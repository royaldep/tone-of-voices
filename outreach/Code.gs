// Paste this entire file into your Google Apps Script editor.
// Deploy as: Execute as "Me", Who has access "Anyone"
// Then paste the Web App URL into the outreach tool's Sheets URL field.

function doPost(e) {
  try {
    const raw = e.parameter.data || e.postData.contents || '{}';
    const data = JSON.parse(raw);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
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

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
