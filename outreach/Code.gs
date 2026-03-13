// Paste this entire file into your Google Apps Script editor.
// Deploy as: Execute as "Me", Who has access "Anyone"
// Then paste the Web App URL into the outreach tool's Sheets URL field.

var OPENS_SHEET = 'OutreachOpens';

function doGet(e) {
  try {
    // Pixel tracking
    if (e.parameter.pixel === '1') {
      logOpen(e.parameter.id || '');
      var gif = Utilities.base64Decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
      var str = gif.map(function(b) { return String.fromCharCode(b); }).join('');
      return ContentService.createTextOutput(str).setMimeType(ContentService.MimeType.GIF);
    }

    // Direct action param
    if (e.parameter.action === 'getOpens') return getOpens();

    // Data-encoded actions
    var raw = (e.parameter && e.parameter.data) ? e.parameter.data : '{}';
    var data = JSON.parse(raw);

    if (data.action === 'createDrafts') return createDrafts(data);
    if (data.action === 'getOpens') return getOpens();

    return respond({ error: 'Unknown action' });
  } catch (err) {
    return respond({ error: err.toString() });
  }
}

function doPost(e) {
  try {
    var raw = e.parameter.data || e.postData.contents || '{}';
    var data = JSON.parse(raw);

    if (data.action === 'createDrafts') return createDrafts(data);

    // --- Sheets sync ---
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = data.sheetName
      ? ss.getSheetByName(data.sheetName)
      : ss.getActiveSheet();
    if (!sheet) return respond({ error: 'Sheet "' + data.sheetName + '" not found.' });

    var lastCol = sheet.getLastColumn();
    var lastRow = sheet.getLastRow();
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0]
      .map(function(h) { return h.toString().trim(); });

    var companyCol = headers.findIndex(function(h) { return h.toLowerCase().includes('company'); });
    var phoneCol   = headers.findIndex(function(h) { return h.toLowerCase().includes('phone'); });
    var nameCol    = headers.findIndex(function(h) { return h.toLowerCase() === 'first name'; });

    if (companyCol === -1 || phoneCol === -1) {
      return respond({ error: 'Could not find Company or Phone columns in your sheet headers.' });
    }

    var values = lastRow > 1 ? sheet.getRange(2, 1, lastRow - 1, lastCol).getValues() : [];
    var matchRow = -1;
    var targetName    = (data.name    || '').toLowerCase().trim();
    var targetCompany = (data.company || '').toLowerCase().trim();
    var targetPhone   = (data.phone   || '').toLowerCase().trim();

    for (var i = 0; i < values.length; i++) {
      var rowCompany = values[i][companyCol].toString().toLowerCase().trim();
      var rowPhone   = values[i][phoneCol].toString().toLowerCase().trim();
      var rowName    = nameCol >= 0 ? values[i][nameCol].toString().toLowerCase().trim() : '';

      var companyMatch = rowCompany === targetCompany;
      var phoneMatch   = rowPhone   === targetPhone;
      var nameMatch    = !targetName || !rowName || rowName === targetName;

      if (companyMatch && phoneMatch && nameMatch) {
        matchRow = i + 2;
        break;
      }
    }

    if (matchRow === -1) {
      return respond({ error: 'No row found matching name "' + data.name + '", company "' + data.company + '" and phone "' + data.phone + '".' });
    }

    var currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      .map(function(h) { return h.toString().trim(); });

    (data.sequences || []).forEach(function(seq, i) {
      var subjectKey = 'subject' + (i + 1);
      var bodyKey    = 'email' + (i + 1);

      var subjectColIdx = currentHeaders.findIndex(function(h) { return h.toLowerCase() === subjectKey; });
      var bodyColIdx    = currentHeaders.findIndex(function(h) { return h.toLowerCase() === bodyKey; });

      if (subjectColIdx === -1) {
        subjectColIdx = currentHeaders.length;
        currentHeaders.push(subjectKey);
        sheet.getRange(1, subjectColIdx + 1).setValue(subjectKey);
      }
      if (bodyColIdx === -1) {
        bodyColIdx = currentHeaders.length;
        currentHeaders.push(bodyKey);
        sheet.getRange(1, bodyColIdx + 1).setValue(bodyKey);
      }

      sheet.getRange(matchRow, subjectColIdx + 1).setValue(seq.subject || '');
      sheet.getRange(matchRow, bodyColIdx + 1).setValue(seq.body || '');
    });

    return respond({ success: true, row: matchRow });

  } catch (err) {
    return respond({ error: err.toString() });
  }
}

// --- Open tracking ---

function getOpensSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(OPENS_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(OPENS_SHEET);
    sheet.getRange(1, 1, 1, 7).setValues([['id','company','phone','seqIndex','firstOpenedAt','lastOpenedAt','openCount']]);
  }
  return sheet;
}

function logOpen(id) {
  if (!id) return;
  var sheet = getOpensSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  var data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
  var now = new Date().toISOString();
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      var rowNum = i + 2;
      if (!data[i][4]) sheet.getRange(rowNum, 5).setValue(now);
      sheet.getRange(rowNum, 6).setValue(now);
      sheet.getRange(rowNum, 7).setValue((Number(data[i][6]) || 0) + 1);
      return;
    }
  }
}

function getOpens() {
  var sheet = getOpensSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return respond({ opens: [] });
  var data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
  var opens = data
    .filter(function(r) { return r[0]; })
    .map(function(r) {
      return {
        id:            String(r[0]),
        company:       String(r[1] || ''),
        phone:         String(r[2] || ''),
        seqIndex:      Number(r[3]) || 0,
        firstOpenedAt: r[4] ? String(r[4]) : null,
        lastOpenedAt:  r[5] ? String(r[5]) : null,
        openCount:     Number(r[6]) || 0
      };
    });
  return respond({ opens: opens });
}

function createDrafts(data) {
  var sheet = getOpensSheet();
  var scriptUrl = data.scriptUrl || '';
  var company   = data.company   || '';
  var phone     = data.phone     || '';
  var created   = [];

  (data.sequences || []).forEach(function(seq, i) {
    var to      = seq.to      || '';
    var subject = seq.subject || '';
    var body    = seq.body    || '';
    if (!to && !subject && !body) return;

    Utilities.sleep(i * 500);

    var id = Utilities.getUuid();
    sheet.appendRow([id, company, phone, i + 1, '', '', 0]);

    var pixel = scriptUrl
      ? '<img src="' + scriptUrl + '?pixel=1&id=' + id + '" width="1" height="1" style="display:none" alt="">'
      : '';
    var htmlBody = body.replace(/\n/g, '<br>') + pixel;

    GmailApp.createDraft(to, subject, body, { htmlBody: htmlBody });
    created.push(i + 1);
  });

  return respond({ success: true, drafts: created });
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
