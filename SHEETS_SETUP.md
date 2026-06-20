# Google Sheets Setup — Pre-call Form

The pre-call form posts lead data to the **Pre-call** tab of your Google Sheet.  
This is done via a **Google Apps Script Web App** — no backend server needed.

---

## Step 1 — Open the spreadsheet

Your sheet:  
https://docs.google.com/spreadsheets/d/1oZCPl-hV5UmPUwIBU6kJB0i-vpOySvhs3s15J58aPwc/edit

Make sure a tab called **Pre-call** exists (create it if not).  
Add these column headers in row 1 (A→I):

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Timestamp | Caller Name | Business Name | Industry | Weekly Call Volume | Pain Points | Current Setup | Call Goal | Status |

---

## Step 2 — Create an Apps Script

1. In the spreadsheet, click **Extensions → Apps Script**
2. Delete any existing code and paste the following:

```javascript
const SHEET_ID = '1oZCPl-hV5UmPUwIBU6kJB0i-vpOySvhs3s15J58aPwc';
const TAB_NAME = 'Pre-call';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(TAB_NAME);
    if (!sheet) throw new Error('Tab "' + TAB_NAME + '" not found');

    sheet.appendRow([
      data.timestamp          || '',
      data.caller_name        || '',
      data.business_name      || '',
      data.industry           || '',
      data.weekly_call_volume || '',
      data.pain_points        || '',
      data.current_setup      || '',
      data.call_goal          || '',
      data.status             || 'Pending',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: test via GET to confirm script is live
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: 'Nexordis Pre-call webhook is live' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Save** (Ctrl+S), give the project any name (e.g. `NexordisPrecall`)

---

## Step 3 — Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙ next to **Type** and select **Web app**
3. Set:
   - **Description:** `Pre-call form webhook`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone` ← **required** so the website can POST without auth
4. Click **Deploy**
5. Copy the **Web App URL** — it looks like:  
   `https://script.google.com/macros/s/AKfycb.../exec`

---

## Step 4 — Add the URL to your project

Create a `.env` file in the project root (copy from `.env.example`):

```env
VITE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Then rebuild:
```
npm run build
```

And re-upload to Hostinger.

---

## Notes

- **CORS:** Apps Script Web Apps allow cross-origin requests by default when "Anyone" access is set.
- **Re-deploy after code changes:** Any edit to the Apps Script requires a **new deployment** to take effect.
- **The call always starts** even if the Sheets write fails — the form logs the error to the browser console but does not block the call.
- **Sheet1 is never touched** — this script only writes to the `Pre-call` tab.
