# PDF Report Hosting Setup Guide

This guide walks through setting up PDF investigation report hosting on the Web3 Portfolio.

## Overview

PDF investigation reports are now hosted directly on Supabase Storage. This allows you to publish detailed on-chain investigations while keeping the portfolio lightweight.

**Key features:**
- Hosted in Supabase Storage (your existing infrastructure)
- No custom PDF viewer needed — uses browser's native PDF reader
- Public read access (anyone with the link can view)
- Secure upload (only you can upload)
- Optional per-project (add only when you have a report to publish)

---

## Step 1: Database Migration

Run the migration to add the `file_url` column to the projects table:

```bash
# Via Supabase Dashboard SQL Editor
# Copy and paste the contents of:
database/migrations/003_add_pdf_report_support.sql
```

The migration adds a single nullable column:
```sql
ALTER TABLE projects ADD COLUMN file_url TEXT DEFAULT NULL;
```

---

## Step 2: Create Storage Bucket

In the **Supabase Dashboard**:

1. Go to **Storage** (left sidebar)
2. Click **Create a new bucket**
3. Name: `reports`
4. Toggle **Public bucket** ON
5. Click **Create bucket**

---

## Step 3: Configure Bucket Policy

In the **Supabase Dashboard**, go to **SQL Editor** and execute:

```sql
CREATE POLICY "Public read access for reports"
ON storage.objects FOR SELECT
USING (bucket_id = 'reports');
```

This allows anyone to read files in the `reports` bucket. Uploads are still restricted to your admin account.

---

## Step 4: Upload Your PDF

### Before uploading, redact sensitive information:

- ✂️ **Remove:** victim wallet addresses, personal identifying information
- ✓ **Keep:** attacker addresses, transaction hashes, public analysis, data visualizations

### Upload process:

1. **Supabase Dashboard** → **Storage** → **reports** bucket
2. Click **Upload file**
3. Select your PDF file
4. Wait for upload to complete
5. Click the file name to view details
6. Copy the **Public URL** (should look like: `https://your-project.supabase.co/storage/v1/object/public/reports/report-name.pdf`)

---

## Step 5: Link PDF to Project

In the **Admin Dashboard** (or directly in the database):

1. Find the project you want to link to
2. Scroll to "PDF Report URL" field
3. Paste the public URL from step 4
4. Save the project

The PDF will now appear on:
- **Work page**: Document icon (📄) in the top right of the project card
- **Project detail page**: "PDF Report ↗" link in the metadata section

---

## Verification Checklist

- [ ] Migration `003_add_pdf_report_support.sql` has been run
- [ ] Storage bucket `reports` exists and is public
- [ ] Bucket policy allows public read access
- [ ] PDF file has been uploaded to the bucket
- [ ] Public URL has been copied and pasted into project editor
- [ ] Project saved successfully
- [ ] Visit `/work` page and confirm PDF icon appears on the card
- [ ] Click PDF icon and verify the report opens in browser

---

## Troubleshooting

### PDF icon isn't showing on the work page

- Check that `file_url` was saved to the database (not empty or null)
- Verify the URL format: should start with `https://`
- Test the URL directly in a new browser tab — should open the PDF

### "Access Denied" when trying to open PDF

- Verify the bucket is set to **Public**
- Verify the bucket policy is set correctly (see Step 3)
- Check that the file was uploaded to the `reports` bucket (not another bucket)

### "Storage bucket doesn't exist"

- Go to **Supabase Dashboard** → **Storage**
- Click **Create a new bucket** if the `reports` bucket is missing
- Ensure you toggle **Public bucket** ON

### Sensitive information was uploaded by mistake

- Go to **Supabase Dashboard** → **Storage** → **reports**
- Delete the file
- Re-upload the redacted version

---

## Usage Notes

### Multiple links per project

A project can have:
- `file_url` → PDF hosted on your Supabase Storage
- `duneUrl` → Link to a Dune Analytics dashboard
- `githubUrl` → Link to GitHub repository
- `demoUrl` → Link to live demo

All are optional and will display independently. Use what's relevant for each project.

### Updating a PDF

To replace a PDF with a newer version:

1. Delete the old file from Storage
2. Upload the new file
3. If the filename changed, update the URL in the project editor
4. Save the project

---

## API Reference

### Database Column

```typescript
// In lib/supabase.ts
interface Project {
  // ... other fields
  file_url?: string  // Supabase Storage public URL
}
```

### Component Props

```typescript
// In components/sections/WorkCard.tsx
interface WorkCardProps {
  project: Project  // includes file_url if present
}

// Renders:
{project.file_url && (
  <a href={project.file_url} target="_blank">
    📄 Report
  </a>
)}
```

---

## Security Notes

⚠️ **Before Publishing:**

Review each PDF for:
- Victim wallet addresses → Redact
- Personal identifying information (names, emails, etc.) → Redact
- Victim transaction patterns → Redact if identifying

✓ **Safe to include:**
- Attacker wallet addresses
- Public transaction hashes
- On-chain analysis and findings
- Data visualizations
- Referenced public sources

### Storage Bucket Security

- ✓ Bucket is **public read** (anyone can download)
- ✓ Upload is **authenticated only** (only you via Supabase)
- ✓ No direct write access from the web app
- ✓ All files are your responsibility

---

## Questions?

See the main project README for contact information and contribution guidelines.
