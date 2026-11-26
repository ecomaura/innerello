# Connect "Talk to us" to a Google Sheet

1. Create a Google Sheet. Name the first row: `time, source, page, Name, Phone, Email, Type, Organization, Message`.
2. In the sheet: Extensions > Apps Script. Replace the code with the script below and save.
3. Deploy > New deployment > type "Web app". Execute as: Me. Who has access: Anyone. Copy the Web app URL.
4. Paste that URL into `SHEET_URL` at the top of `js/main.js` and publish the site.

```js
function doPost(e){
  const sh=SpreadsheetApp.getActiveSheet();
  const h=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
  sh.appendRow(h.map(k=>e.parameter[k]||''));
  return ContentService.createTextOutput('ok');
}
```
Until `SHEET_URL` is set, the form opens WhatsApp with the details so no lead is lost.
