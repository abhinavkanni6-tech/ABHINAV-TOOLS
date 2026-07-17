(function(){
  // Client-side admin uploader that uses a GitHub Personal Access Token (PAT).
  // Configuration
  const OWNER = 'abhinavkanni6-tech';
  const REPO = 'ABHINAV-TOOLS';
  const BRANCH = 'main';

  // Elements
  const patField = document.getElementById('pat');
  const savePatBtn = document.getElementById('save-pat');
  const clearPatBtn = document.getElementById('clear-pat');
  const patMsg = document.getElementById('pat-msg');
  const uploaderArea = document.getElementById('uploader-area');
  const fileInput = document.getElementById('file-input');
  const displayNameInput = document.getElementById('displayName');
  const readmeInput = document.getElementById('readme');
  const uploadBtn = document.getElementById('upload-btn');
  const uploadMsg = document.getElementById('upload-msg');

  const SESSION_KEY = 'abh_tools_pat';

  function setToken(t){ sessionStorage.setItem(SESSION_KEY,t); }
  function getToken(){ return sessionStorage.getItem(SESSION_KEY); }
  function clearToken(){ sessionStorage.removeItem(SESSION_KEY); }

  function showUploader(){ document.getElementById('token-area').style.display = 'none'; uploaderArea.style.display = 'block'; }
  function showTokenArea(){ document.getElementById('token-area').style.display = 'block'; uploaderArea.style.display = 'none'; }

  // Init
  const existing = getToken();
  if(existing){ patField.value = '●●●●●●●● (saved for session)'; patField.disabled = true; patMsg.textContent = 'Token loaded for this session. Use Clear token to remove it.'; showUploader(); }

  savePatBtn.addEventListener('click', ()=>{
    const raw = patField.value.trim();
    if(!raw){ patMsg.textContent = 'Please paste a valid token.'; return; }
    setToken(raw);
    patField.value = '●●●●●●●● (saved for session)'; patField.disabled = true; patMsg.textContent = 'Token saved for this browser session.'; showUploader();
  });

  clearPatBtn.addEventListener('click', ()=>{
    clearToken(); patField.value = ''; patField.disabled = false; patMsg.textContent = 'Token cleared.'; showTokenArea();
  });

  // Utility: base64 encode array buffer
  function arrayBufferToBase64(buffer){
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
  }

  // GitHub API helpers
  async function api(path, method='GET', token, body){
    const url = 'https://api.github.com' + path;
    const headers = { 'Accept': 'application/vnd.github+json' };
    if(token) headers['Authorization'] = 'token ' + token;
    if(body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json';
    const res = await fetch(url, { method, headers, body: body && (!(body instanceof FormData) ? JSON.stringify(body) : body) });
    if(!res.ok){ const txt = await res.text(); throw new Error(`GitHub API ${method} ${path} failed: ${res.status} ${txt}`); }
    return res.json();
  }

  async function uploadFileToRepo(token, file){
    const filename = file.name;
    const path = `uploads/${filename}`;
    uploadMsg.textContent = `Reading file ${filename}...`;
    const buffer = await file.arrayBuffer();
    const b64 = arrayBufferToBase64(buffer);
    uploadMsg.textContent = `Uploading ${filename} to repository...`;
    const message = `Upload ${filename} via site admin uploader`;
    const putBody = { message, content: b64, branch: BRANCH };
    // PUT /repos/{owner}/{repo}/contents/{path}
    const resp = await api(`/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}`, 'PUT', token, putBody);
    return { path, url: resp.content && resp.content.download_url };
  }

  async function getFilesJson(token){
    try{
      const res = await api(`/repos/${OWNER}/${REPO}/contents/files.json`, 'GET', token);
      const content = atob(res.content);
      const data = JSON.parse(content);
      return { data, sha: res.sha };
    }catch(err){
      // If 404, return empty
      if(err.message && err.message.includes('404')) return { data: { files: [] }, sha: null };
      throw err;
    }
  }

  async function putFilesJson(token, jsonObj, sha){
    const contentStr = JSON.stringify(jsonObj, null, 2);
    const b64 = btoa(unescape(encodeURIComponent(contentStr)));
    const body = { message: 'Update files.json via admin uploader', content: b64, branch: BRANCH };
    if(sha) body.sha = sha;
    const res = await api(`/repos/${OWNER}/${REPO}/contents/files.json`, 'PUT', token, body);
    return res;
  }

  function makeId(){ return 'f-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,8); }

  uploadBtn.addEventListener('click', async ()=>{
    uploadMsg.textContent = '';
    const token = getToken();
    if(!token){ uploadMsg.textContent = 'No token found — paste a PAT and Save token first.'; return; }
    const file = fileInput.files[0];
    if(!file){ uploadMsg.textContent = 'Please choose a file to upload.'; return; }
    const displayName = (displayNameInput.value || file.name).trim();
    const readme = (readmeInput.value || '').trim();

    try{
      uploadMsg.textContent = 'Uploading file...';
      const uploadRes = await uploadFileToRepo(token, file);
      uploadMsg.textContent = `File uploaded: ${uploadRes.url || uploadRes.path}`;

      // Update files.json
      uploadMsg.textContent = 'Updating files.json manifest...';
      const { data, sha } = await getFilesJson(token);
      if(!Array.isArray(data.files)) data.files = [];
      const entry = {
        id: makeId(),
        filename: uploadRes.path,
        displayName: displayName,
        readme: readme,
        url: uploadRes.url || `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${uploadRes.path}`,
        uploaded_at: new Date().toISOString(),
        uploader: OWNER
      };
      // Prepend so newest first
      data.files.unshift(entry);
      await putFilesJson(token, data, sha);
      uploadMsg.innerHTML = `Success — file published. <a href="/${entry.filename}" target="_blank">View raw file</a> · <a href="/" target="_blank">Open dashboard</a>`;

      // Clear inputs
      fileInput.value = ''; displayNameInput.value = ''; readmeInput.value = '';
    }catch(err){
      console.error(err);
      uploadMsg.textContent = 'Upload failed: ' + (err.message || err);
    }
  });
})();
