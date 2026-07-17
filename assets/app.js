(function(){
  // Config — set to your repo
  const OWNER = 'abhinavkanni6-tech';
  const REPO = 'ABHINAV-TOOLS';
  const BRANCH = 'main';

  const filesJsonPath = '/files.json';

  const el = id => document.getElementById(id);
  const grid = el('grid');
  const search = el('search');
  const modal = el('modal');
  const modalTitle = el('modal-title');
  const modalBody = el('modal-body');
  const modalDownload = el('modal-download');
  const closeModalBtn = el('close-modal');

  function rawUrl(path){
    return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path}`;
  }

  function renderCard(f){
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h3 class="title">${escapeHtml(f.displayName||f.filename)}</h3>
      <div class="meta">${escapeHtml(f.uploaded_at || '')} • ${escapeHtml(f.uploader||'')}</div>
      <div class="actions">
        <a class="btn primary" href="${escapeAttr(f.url||rawUrl(f.filename))}" target="_blank" rel="noopener">Download</a>
        <button class="btn ghost" data-id="${escapeAttr(f.id)}">Read</button>
      </div>`;
    const readBtn = card.querySelector('button');
    readBtn.addEventListener('click', ()=>openReadme(f));
    return card;
  }

  function openReadme(f){
    modalTitle.textContent = f.displayName || f.filename;
    modalBody.innerHTML = markdownToHtml(escapeHtml(f.readme||'No description provided.'));
    modalDownload.href = f.url || rawUrl(f.filename);
    modalDownload.textContent = 'Download ' + (f.displayName||f.filename);
    modal.setAttribute('aria-hidden','false');
  }

  function closeModal(){ modal.setAttribute('aria-hidden','true'); }
  closeModalBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });

  function load(){
    fetch(filesJsonPath).then(r=>r.json()).then(data=>{
      const list = data.files||[];
      window.ALL_FILES = list;
      render(list);
    }).catch(err=>{
      grid.innerHTML = '<div class="card">Failed to load files.json — check repository.</div>';
      console.error(err);
    });
  }

  function render(list){
    grid.innerHTML = '';
    if(!list.length) grid.innerHTML = '<div class="card">No files published yet.</div>';
    list.forEach(f=>grid.appendChild(renderCard(f)));
  }

  function escapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function escapeAttr(s){ return (String(s||'')).replace(/"/g,'&quot;'); }

  function markdownToHtml(md){
    // Very small markdown -> html helper (supports links and bold)
    return md
      .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
      .replace(/\*(.*?)\*/g,'<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\n/g,'<br>');
  }

  search.addEventListener('input', ()=>{
    const q = search.value.trim().toLowerCase();
    const list = (window.ALL_FILES||[]).filter(f=>{
      return (f.displayName||f.filename||'').toLowerCase().includes(q) || (f.readme||'').toLowerCase().includes(q);
    });
    render(list);
  });

  // Kick off
  load();
})();
