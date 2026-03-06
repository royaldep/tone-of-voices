// Paste this entire file into your Google Apps Script editor.
// Deploy as: Execute as "Me", Who has access "Anyone"
// Then paste the Web App URL into the outreach tool's Sheets URL field.

function doGet(e) {
  try {
    const raw = (e.parameter && e.parameter.data) ? e.parameter.data : '{}';
    const data = JSON.parse(raw);
    if (data.action === 'createDrafts') {
      return createDrafts(data);
    }
    return respond({ error: 'Unknown action' });
  } catch (err) {
    return respond({ error: err.toString() });
  }
}

function doPost(e) {
  try {
    const raw = e.parameter.data || e.postData.contents || '{}';
    const data = JSON.parse(raw);

    // Route to draft creation if that's the action
    if (data.action === 'createDrafts') {
      return createDrafts(data);
    }

    // --- Sheets sync ---
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = data.sheetName
      ? ss.getSheetByName(data.sheetName)
      : ss.getActiveSheet();
    if (!sheet) return respond({ error: `Sheet "${data.sheetName}" not found.` });
    const lastCol = sheet.getLastColumn();
    const lastRow = sheet.getLastRow();

    // Read headers from row 1
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0]
      .map(h => h.toString().trim());

    // Find company and phone columns
    const companyCol = headers.findIndex(h => h.toLowerCase().includes('company'));
    const phoneCol   = headers.findIndex(h => h.toLowerCase().includes('phone'));

    if (companyCol === -1 || phoneCol === -1) {
      return respond({ error: 'Could not find Company or Phone columns in your sheet headers.' });
    }

    // Find matching row (skip header row 1)
    const values = lastRow > 1
      ? sheet.getRange(2, 1, lastRow - 1, lastCol).getValues()
      : [];

    let matchRow = -1;
    const targetCompany = (data.company || '').toLowerCase().trim();
    const targetPhone   = (data.phone   || '').toLowerCase().trim();

    for (let i = 0; i < values.length; i++) {
      const rowCompany = values[i][companyCol].toString().toLowerCase().trim();
      const rowPhone   = values[i][phoneCol].toString().toLowerCase().trim();
      if (rowCompany === targetCompany && rowPhone === targetPhone) {
        matchRow = i + 2; // +2: 1-indexed + skip header
        break;
      }
    }

    if (matchRow === -1) {
      return respond({ error: `No row found matching company "${data.company}" and phone "${data.phone}".` });
    }

    // Re-read headers in case we need to add columns
    const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      .map(h => h.toString().trim());

    // Write each sequence's subject + body
    (data.sequences || []).forEach((seq, i) => {
      const subjectKey = `subject${i + 1}`;
      const bodyKey    = `email${i + 1}`;

      let subjectColIdx = currentHeaders.findIndex(h => h.toLowerCase() === subjectKey);
      let bodyColIdx    = currentHeaders.findIndex(h => h.toLowerCase() === bodyKey);

      // Create columns if they don't exist yet
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

function createDrafts(data) {
  const created = [];
  (data.sequences || []).forEach((seq, i) => {
    const to      = seq.to || '';
    const subject = seq.subject || '';
    const body    = seq.body || '';
    if (!to && !subject && !body) return; // skip fully empty sequences
    GmailApp.createDraft(to, subject, body);
    created.push(i + 1);
  });
  return respond({ success: true, drafts: created });
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
