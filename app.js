// Mobile drawer close support + Supabase service catalogue
const siteMenu=document.getElementById('site-menu');
const drawerClose=document.getElementById('drawer-close');
function closeSiteMenu(){if(siteMenu)siteMenu.removeAttribute('open')}
drawerClose?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();closeSiteMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSiteMenu()});

document.querySelectorAll('.drawer-services a').forEach(a=>a.addEventListener('click',()=>closeSiteMenu()));

const config=window.SUPABASE_CONFIG;
if(config?.url&&config?.key&&window.supabase){
 const db=window.supabase.createClient(config.url,config.key);
 const grid=document.getElementById('service-grid');
 async function loadServices(){
  const {data,error}=await db.from('services').select('id,name,description,icon').eq('active',true).order('id');
  if(error){if(grid)grid.innerHTML='<p>Services are temporarily unavailable.</p>';return}
  const services=data||[];
  if(grid)grid.innerHTML=services.map(s=>'<article class="service"><div class="service-icon">'+(s.icon||'🔧')+'</div><h3>'+s.name+'</h3><p>'+(s.description||'')+'</p></article>').join('');
 }
 loadServices();
}else{
 const grid=document.getElementById('service-grid');
 if(grid)grid.innerHTML='<p>Services are loading. Please refresh.</p>';
}