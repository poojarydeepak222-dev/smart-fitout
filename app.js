const config=window.SUPABASE_CONFIG;

// Mobile drawer
const drawer=document.getElementById('drawer');
const overlay=document.getElementById('drawer-overlay');
const menuBtn=document.getElementById('menu-btn');
const drawerClose=document.getElementById('drawer-close');
function openDrawer(){drawer.classList.add('open');overlay.classList.add('open');drawer.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeDrawer(){drawer.classList.remove('open');overlay.classList.remove('open');drawer.setAttribute('aria-hidden','true');document.body.style.overflow=''}
menuBtn?.addEventListener('click',openDrawer);drawerClose?.addEventListener('click',closeDrawer);overlay?.addEventListener('click',closeDrawer);
document.querySelectorAll('.drawer-services a').forEach(a=>a.addEventListener('click',closeDrawer));
document.getElementById('hero-services')?.addEventListener('click',openDrawer);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});

// Supabase service catalogue
if(config?.url&&config?.key){
 const db=window.supabase.createClient(config.url,config.key);
 const grid=document.getElementById('service-grid');
 const select=document.getElementById('service-select');
 async function loadServices(){
  const {data,error}=await db.from('services').select('id,name,description,icon').eq('active',true).order('id');
  if(error){grid.innerHTML='<p>Services are temporarily unavailable.</p>';return}
  const services=data||[];
  grid.innerHTML=services.map(s=>'<article class="service"><div class="service-icon">'+(s.icon||'🔧')+'</div><h3>'+s.name+'</h3><p>'+(s.description||'')+'</p></article>').join('');
  select.innerHTML='<option value="">Select a service</option>'+services.map(s=>'<option value="'+s.id+'">'+s.name+'</option>').join('');
  document.querySelectorAll('.drawer-services a').forEach(a=>a.addEventListener('click',()=>{const name=a.dataset.service;const match=services.find(s=>s.name===name);if(match)select.value=match.id}));
 }
 loadServices();
}else{document.getElementById('service-grid').innerHTML='<p>Supabase configuration is missing.</p>'}

// Prevent accidental drawer link hash jump before selection
window.addEventListener('load',()=>{document.querySelectorAll('.drawer-services a').forEach(a=>a.addEventListener('click',()=>setTimeout(()=>document.getElementById('request')?.scrollIntoView({behavior:'smooth'}),50)))})