## Admin uploader (PAT) — how to create a Personal Access Token (PAT)

This repository now includes a secure client-side uploader that uses a GitHub Personal Access Token (PAT) stored only in your browser session (sessionStorage). The uploader will:
- Upload the selected file into `uploads/<filename>` in this repo.
- Update `files.json` to include a manifest entry so the public dashboard shows the file.

Steps to create a PAT (recommended for public repo):
1. Go to https://github.com/settings/tokens (or https://github.com/settings/tokens/new).
2. Click "Generate new token" (classic) or "Generate new token (classic)" depending on the UI.
3. Give it a name like "ABHINAV TOOLS uploader" and set an expiration (e.g., 1 day or 7 days).
4. For a public repository, select the `public_repo` scope. For a private repo select `repo`.
5. Generate the token and copy it.

How to use the uploader UI:
1. Open the admin page: /admin.html (once GitHub Pages is enabled) or open the file in the repo and use the raw file in your browser.
2. Paste the PAT into the token textarea and click "Save token (for this session)".
3. Choose a file, add a display name and a short description, and click "Upload to repo and publish".
4. After upload, the uploader will update files.json and the file will appear on the dashboard.
5. When finished, click "Clear token" and optionally revoke the PAT in your GitHub settings.

Security notes:
- The PAT is only stored in your browser's sessionStorage and is never sent to any server except GitHub (i.e., it is used client-side to call the GitHub API).
- Revoke the token after use or create short-lived tokens.
- Do NOT share the token.
