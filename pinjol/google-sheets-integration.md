# Google Sheets integration (Apps Script)

This short guide shows how to receive POSTed JSON from the form and append it to a Google Sheet using Apps Script.

1. Create a Google Sheet and note its ID (from the URL).
2. Open **Extensions → Apps Script** and replace code with the sample below.

Sample Apps Script (Code.gs):

```javascript
function doPost(e){
  try{
    var ss = SpreadsheetApp.openById('REPLACE_WITH_SPREADSHEET_ID');
    var sh = ss.getSheetByName('Sheet1') || ss.getSheets()[0];
    var payload = JSON.parse(e.postData.contents);
    sh.appendRow([new Date(), payload.amount, payload.fee, payload.total, payload.term, payload.reason, payload.submittedAt]);
    return ContentService
      .createTextOutput(JSON.stringify({result:'success'}))
      .setMimeType(ContentService.MimeType.JSON);
  }catch(err){
    return ContentService
      .createTextOutput(JSON.stringify({result:'error', message:err.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Deploy: **Deploy → New deployment → Web app**. Set "Execute as" to **Me** and "Who has access" to **Anyone** or **Anyone, even anonymous** depending on your needs.

4. Use the deployment URL in `pinjol/new-loan.js` by replacing `REPLACE_WITH_YOUR_DEPLOYED_URL` with the web app URL.

Notes:
- If you plan to call the URL from client-side JS (fetch), the deployment must allow access from anonymous users. Some browsers may still enforce CORS; if you see CORS errors, consider submitting the form via a normal HTML `form` POST or server-side proxy.
- For simple use, you can also create a Google Form and link it to the sheet (easiest, no code), but the Apps Script way gives you structured JSON and control over validation and response.
