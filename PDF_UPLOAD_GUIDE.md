# PDF Upload from Admin Panel — Quick Guide

You can now upload PDF investigation reports directly from the admin dashboard. No need to go to the Supabase dashboard manually.

## How to Upload a PDF

### Step 1: Go to Admin Dashboard
- Navigate to your admin panel: `/admin/projects`
- Click on a project to edit, or create a new one

### Step 2: Upload PDF
In the **"PDF Report"** section, you'll see:
- **Upload area**: Click to select a PDF file from your computer
- **Status**: Shows upload progress
- **Success indicator**: Green box with the public URL appears after upload

### Step 3: Save Project
Click **"Save Project"** button to save the PDF URL to your project.

---

## What Gets Uploaded?

- **File goes to**: Supabase Storage → `reports` bucket
- **Automatically public**: URL is immediately available
- **Unique filename**: System adds timestamp to prevent conflicts
- **No manual URL copy needed**: Admin panel does it automatically

---

## Security Reminder

⚠️ **Before clicking upload**, review the PDF for:

### Redact (Remove):
- Victim wallet addresses
- Names, emails, personal information
- Victim transaction patterns that could identify them

### Safe to keep:
- Attacker wallet addresses
- Public transaction hashes
- Analysis and findings
- Data visualizations

---

## Troubleshooting

### "File size exceeds 50MB limit"
PDFs must be under 50MB. Most investigation reports are much smaller.

### "Only PDF files are allowed"
Make sure you're selecting a `.pdf` file, not an image or document.

### Upload fails silently
Check your browser console (F12 → Console) for error details. Common issues:
- Network connection problem
- Supabase authentication expired (refresh page and try again)
- Storage bucket doesn't exist (should be auto-created during setup)

### URL appears but PDF won't open
Wait a few seconds — Supabase Storage needs a moment to process the file. Then refresh your browser and click the link again.

---

## Manual Alternative

If the upload doesn't work, you can still:
1. Go to Supabase Dashboard → Storage → reports bucket
2. Upload your PDF manually
3. Copy the public URL
4. Paste it into the "PDF Report URL" field manually

---

## What Happens After Save?

Once saved, the PDF link will appear:
- **Work page** (`/work`): Document icon (📄) in top right of project card
- **Project detail page** (`/work/[id]`): "PDF Report ↗" link in metadata section

Click the link and the PDF opens in your browser's native PDF viewer.

---

## Questions?

See the main `PDF_REPORT_SETUP.md` for detailed configuration information.
