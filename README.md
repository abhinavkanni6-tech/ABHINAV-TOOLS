# ABHINAV TOOLS AND BOTS

This repository contains a beautiful dashboard (GitHub Pages) that lists files that an admin can upload. Visitors can view the readme/description and download files.

## What I pushed
- index.html — public dashboard
- admin.html — instructions for admin manual uploads
- assets/styles.css — site styles
- assets/app.js — frontend logic
- files.json — manifest with one demo entry
- uploads/demo.txt — a demo file
- CNAME — contains your custom domain ABHINAV.TOOLS

## How to enable GitHub Pages
1. Go to Settings → Pages in your repository.
2. Under "Source", select branch `main` and folder `/ (root)`, then click Save.
3. GitHub will publish your site. It may take a minute.

## Custom domain (ABHINAV.TOOLS)
I added a `CNAME` file with `ABHINAV.TOOLS`. To connect your domain:

Add the following A records at your domain registrar for the apex domain:
- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

If you want `www.ABHINAV.TOOLS` to redirect, add a CNAME for `www` to `abhinavkanni6-tech.github.io`.

After adding DNS records, go to Settings → Pages and verify the custom domain.

## How to upload files (admin — manual)
1. In your repository click Code → Add file → Upload files.
2. Upload a file into the `uploads/` folder (create it if it doesn't exist).
3. Commit changes.
4. Edit `files.json` in-place and add an object describing the file (see example in admin.html).
5. Commit `files.json`. The website will show the new file automatically.

Example `files.json` entry:
```
{
  "id": "example-tool-1",
  "filename": "uploads/example-tool.zip",
  "displayName": "Example Tool Pack",
  "readme": "Short description for the tool. You can use Markdown and basic HTML.",
  "url": "https://raw.githubusercontent.com/abhinavkanni6-tech/ABHINAV-TOOLS/main/uploads/example-tool.zip",
  "uploaded_at": "2026-07-17T12:00:00Z",
  "uploader": "admin"
}
```

## Next steps I can help with
- Add an authenticated client-side uploader using a temporary Personal Access Token.
- Improve markdown rendering with a library.
- Add tags/categories and pagination.

If you want me to add those features, tell me which one and I'll implement them.
