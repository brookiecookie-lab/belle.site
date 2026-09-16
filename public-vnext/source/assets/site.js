(function(){
  const cfg = window.SITE_CONFIG || {};
  document.querySelectorAll('[data-brand-name]').forEach(el=>el.textContent=cfg.brandName || 'Brand');
  document.querySelectorAll('[data-pages-we-keep]').forEach(el=>{
    if(cfg.pagesWeKeepUrl){ el.href=cfg.pagesWeKeepUrl; el.removeAttribute('aria-disabled'); }
    else { el.href='#'; el.setAttribute('aria-disabled','true'); el.title='Standalone property URL not configured in this build'; }
  });
  const toggle=document.querySelector('.menu-toggle'); const nav=document.querySelector('.primary-nav');
  if(toggle&&nav) toggle.addEventListener('click',()=>{ const open=nav.classList.toggle('open'); toggle.setAttribute('aria-expanded',String(open)); });

  document.querySelectorAll('.square-toggle').forEach(btn=>btn.addEventListener('click',()=>btn.setAttribute('aria-pressed', btn.getAttribute('aria-pressed')==='true'?'false':'true')));

  const mtmForm=document.querySelector('[data-mtm-form]');
  if(mtmForm){
    mtmForm.addEventListener('submit',e=>{
      e.preventDefault();
      const selected=[...document.querySelectorAll('.square-toggle[aria-pressed="true"]')].map(b=>b.dataset.value);
      const result=document.querySelector('[data-mtm-result]');
      result.innerHTML=`<div class="notice"><strong>Request captured for this interpretation.</strong>${selected.length?selected.join(' · '):'No translation controls selected yet.'}<br><small>No identity has been assigned or inferred.</small></div>`;
    });
  }

  const BOARD_KEY='ackoe_guest_board_v1';
  const loadBoard=()=>{ try{return JSON.parse(localStorage.getItem(BOARD_KEY)||'[]')}catch(e){return[]} };
  const saveBoard=(x)=>localStorage.setItem(BOARD_KEY,JSON.stringify(x));
  function renderBoard(){
    const grid=document.querySelector('[data-board-grid]'); if(!grid)return;
    const items=loadBoard();
    grid.innerHTML=items.length?items.map((item,i)=>`<article class="board-item"><button aria-label="Remove ${item.title}" data-remove-board="${i}">×</button><div class="visual">${item.title}</div><div class="meta"><span class="status">${item.type}</span><div>${item.note||'Saved by you.'}</div></div></article>`).join(''):'<div class="empty">Your guest board is empty. Add an idea below. It stays in this browser until account persistence is connected.</div>';
    grid.querySelectorAll('[data-remove-board]').forEach(btn=>btn.addEventListener('click',()=>{const a=loadBoard();a.splice(Number(btn.dataset.removeBoard),1);saveBoard(a);renderBoard()}));
  }
  const addBoard=document.querySelector('[data-add-board]');
  if(addBoard){ addBoard.addEventListener('click',()=>{ const title=document.querySelector('#board-title').value.trim(); const type=document.querySelector('#board-type').value; if(!title)return; const a=loadBoard(); a.unshift({title,type,note:'Guest board item'}); saveBoard(a); document.querySelector('#board-title').value=''; renderBoard(); }); renderBoard(); }

  const searchInput=document.querySelector('[data-site-search]');
  if(searchInput){
    const corpus=[
      {type:'World',title:'Modern Prep',desc:'Tradition, corrected.',url:'worlds.html#modern-prep'},
      {type:'World',title:'Sicilian September',desc:'A current seasonal expression with place-informed grammar.',url:'worlds.html#sicilian-september'},
      {type:'Archetype route',title:'Intellectual Woman',desc:'See the Worlds she moves through.',url:'worlds.html#start-with-her'},
      {type:'Intelligence',title:'Fit Intelligence',desc:'What actually changes the fit.',url:'intelligence.html#fit'},
      {type:'Intelligence',title:'Footwear Intelligence',desc:'Width, pitch, break-in, stability and walking reality.',url:'intelligence.html#footwear'},
      {type:'Editorial',title:'belle. No Capital.',desc:'Fashion, culture, and the real life underneath both.',url:'belle.html'},
      {type:'Personalization',title:'Make This Me',desc:'Translate inspiration into your actual life.',url:'make-this-me.html'},
      {type:'Product',title:'The Everyday Blazer',desc:'Frozen PDP fixture: a modern classic for real life.',url:'pdp-route-contract.html'},
      {type:'Shop',title:'Shop',desc:'Products we sell and products we recommend elsewhere.',url:'shop.html'},
      {type:'Digital product',title:'Digital Products',desc:'Standalone digital product system.',url:'digital-products.html'}
    ];
    const results=document.querySelector('[data-search-results]');
    const render=(q='')=>{ const s=q.toLowerCase().trim(); const rows=corpus.filter(x=>!s||(`${x.type} ${x.title} ${x.desc}`).toLowerCase().includes(s)); results.innerHTML=rows.map(x=>`<a class="result" href="${x.url}"><span class="type">${x.type}</span><h3>${x.title}</h3><p>${x.desc}</p></a>`).join('')||'<div class="empty">No local fixture matches. Live governed search is not connected in this branch yet.</div>'; };
    searchInput.addEventListener('input',()=>render(searchInput.value)); render('');
  }

  const externalLinks=document.querySelectorAll('[aria-disabled="true"]');
  externalLinks.forEach(a=>a.addEventListener('click',e=>e.preventDefault()));
})();
