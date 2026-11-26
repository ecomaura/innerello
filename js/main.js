const WA='919121052932';
/* Paste the Google Apps Script web-app URL here (see docs/google-sheet-setup.md).
   Until it is set, "Talk to us" forms fall back to WhatsApp so no lead is lost. */
const SHEET_URL='https://script.google.com/macros/s/AKfycbzffMNbAWAtrIMF9T-_Z2cUM-SBdajfac8kyLH7bmmiHnr_48AfyObbPUotTZ2fTxYP/exec';

const burger=document.querySelector('.burger');
if(burger)burger.onclick=e=>{const u=document.querySelector('.nav ul');u.classList.toggle('open');e.target.setAttribute('aria-expanded',u.classList.contains('open'))};

function toSheet(source,data){
 if(!SHEET_URL)return Promise.resolve(false);
 const body=new URLSearchParams({source,page:location.pathname,time:new Date().toISOString(),...data});
 return fetch(SHEET_URL,{method:'POST',mode:'no-cors',body}).then(()=>true).catch(()=>false);
}
function waOpen(msg){window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,'_blank','noopener')}

/* existing forms: log to the sheet (if set) and open WhatsApp */
document.querySelectorAll('form[data-wa]').forEach(f=>f.onsubmit=e=>{e.preventDefault();
 const d=Object.fromEntries(new FormData(f));let m=f.dataset.wa+'\n';for(const k in d)if(d[k])m+=`${k}: ${d[k]}\n`;
 toSheet(f.dataset.wa,d);waOpen(m);
 const ok=f.querySelector('.ok');if(ok)ok.style.display='block';f.reset()});

/* "Talk to us" -> short lead form that writes to the Google Sheet */
const dlg=document.createElement('dialog');dlg.className='talk';
dlg.innerHTML=`<div class="in"><button class="x" type="button" aria-label="Close">&times;</button><h2>Talk to us</h2><p class="lead" style="font-size:1rem">Leave your details and our team will call you back within 1 to 2 working days.</p><br>
<form id="talkForm"><label>Name<input name="Name" required autocomplete="name"></label><label>Phone<input name="Phone" type="tel" required autocomplete="tel"></label><label>Email<input name="Email" type="email" autocomplete="email"></label><label>I am reaching out as<select name="Type"><option>Organization</option><option>Institution</option><option>Individual learner</option></select></label><label>Organization / Institution<input name="Organization"></label><label>How can we help?<input name="Message"></label><button class="btn" type="submit">Talk to us</button><div class="ok">Thank you. We will be in touch shortly.</div><div class="err">Something went wrong. Please message us on WhatsApp instead.</div></form></div>`;
document.body.appendChild(dlg);
dlg.querySelector('.x').onclick=()=>dlg.close();
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
document.querySelectorAll('[data-talk]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();dlg.querySelector('.ok').style.display='none';dlg.showModal()}));
document.getElementById('talkForm').onsubmit=async e=>{e.preventDefault();const f=e.target,d=Object.fromEntries(new FormData(f));
 const ok=await toSheet('Talk to us',d);
 if(ok){f.reset();f.querySelector('.ok').style.display='block';f.querySelector('.err').style.display='none'}
 else{let m='Hi Innerello, I would like to talk to your team.\n';for(const k in d)if(d[k])m+=`${k}: ${d[k]}\n`;waOpen(m);f.querySelector('.ok').style.display='block'}};

/* ===== Motion: scroll reveals, count-up, progress bar, page transitions ===== */
(function(){
 const root=document.documentElement;
 if(matchMedia('(prefers-reduced-motion:reduce)').matches||!('IntersectionObserver' in window))return;
 try{
  root.classList.add('js');
  const seen=new Set(),kids=new Map();
  const tag=(sel,variant,opts={})=>document.querySelectorAll(sel).forEach(el=>{
   if(seen.has(el))return;seen.add(el);
   let v=variant;
   if(opts.flip&&el.parentElement.classList.contains('rev'))v=v==='rv-left'?'rv-right':'rv-left';
   el.classList.add('rv');if(v)el.classList.add(v);
   let d=opts.delay||0;
   if(opts.stagger){const p=el.parentElement,n=kids.get(p)||0;kids.set(p,n+1);d+=Math.min(n,7)*.16}
   if(d)el.style.setProperty('--d',d+'s');
  });
  /* hero and page banners play on load, in sequence */
  tag('.hero h1','',{delay:.2});tag('.hero .lead','',{delay:.5});tag('.hero .row','',{delay:.8});
  tag('.chip.c1','rv-pop',{delay:1.3});tag('.chip.c2','rv-pop',{delay:1.7});
  tag('.pg .wrap>*','',{stagger:1,delay:.2});
  /* section headings and intro text */
  tag('.sec-h,.wrap>h2,.wrap>h3,.wrap>.lead,.wrap>.badge,.wrap>.who,.wrap>.gapnote,.wrap>.tags,.wrap>.strip');
  /* two-column layouts slide in from opposite sides */
  tag('.split>:first-child,.ws>:first-child,.demo>:first-child','rv-left',{flip:1});
  tag('.split>:last-child,.ws>:last-child,.demo>:last-child','rv-right',{flip:1});
  tag('.founder>:first-child','rv-zoom');tag('.founder>:last-child','rv-right');
  tag('.split img','rv-zoom',{delay:.25});
  /* groups cascade one after another */
  tag('.g>*,.rich>*,.steps>*,.engage>*,.flow>*,.gapmap>.gm,.evl li,.cal li,.bridge>div,.season>div,.vm>*,footer .wrap>div:first-child>div','',{stagger:1});
  tag('.stats .wrap>div','rv-pop',{stagger:1});
  tag('.ticks li,details,.panel,.strip','',{stagger:1});
  tag('.cta','rv-zoom');tag('.price','rv-pop');tag('.donut','rv-zoom');
  /* line-drawing containers need no hiding, only the .in signal */
  const watch=document.querySelectorAll('.gapmap,.flow');

  /* count-up for stat numbers */
  const counters=[];
  document.querySelectorAll('.stats b').forEach(b=>{
   const m=b.textContent.trim().match(/^([\d,.]+)(.*)$/);if(!m)return;
   const end=parseFloat(m[1].replace(/,/g,'')),dec=(m[1].split('.')[1]||'').length,comma=m[1].includes(',');
   b._c={end,dec,comma,suf:m[2]};counters.push(b);
   b.textContent=(0).toFixed(dec)+m[2];
  });
  const run=b=>{const {end,dec,comma,suf}=b._c,t0=performance.now(),D=2200;
   const f=t=>{const p=Math.min((t-t0)/D,1),e=1-Math.pow(1-p,3),v=end*e;
    b.textContent=(comma?Math.round(v).toLocaleString('en-US'):v.toFixed(dec))+suf;
    if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)};

  const io=new IntersectionObserver(es=>es.forEach(e=>{
   if(!e.isIntersecting)return;
   e.target.classList.add('in');
   if(e.target._c)run(e.target);
   if(e.target.classList.contains('stats'))e.target.querySelectorAll('b').forEach(b=>b._c&&run(b));
   io.unobserve(e.target);
  }),{threshold:.15,rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.rv').forEach(el=>io.observe(el));
  watch.forEach(el=>io.observe(el));
  counters.forEach(b=>io.observe(b));
  /* safety net: never leave content hidden */
  setTimeout(()=>document.querySelectorAll('.rv:not(.in)').forEach(el=>{const r=el.getBoundingClientRect();if(r.top<innerHeight)el.classList.add('in')}),3500);

  /* scroll progress bar + header shadow */
  const sp=document.createElement('div');sp.className='sp';document.body.appendChild(sp);
  const hd=document.querySelector('header');let tick=false;
  const upd=()=>{tick=false;const h=document.documentElement.scrollHeight-innerHeight;
   sp.style.transform=`scaleX(${h>0?scrollY/h:0})`;if(hd)hd.classList.toggle('scrolled',scrollY>8)};
  addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});upd();

  /* soft fade between pages */
  document.addEventListener('click',e=>{
   const a=e.target.closest&&e.target.closest('a');
   if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button)return;
   if(a.target||a.hasAttribute('download')||a.hasAttribute('data-talk')||a.origin!==location.origin)return;
   if(!(a.pathname.endsWith('.html')||a.pathname.endsWith('/'))||(a.pathname===location.pathname&&a.hash))return;
   e.preventDefault();document.body.classList.add('leaving');setTimeout(()=>{location.href=a.href},480);
  });
  addEventListener('pageshow',e=>{if(e.persisted)document.body.classList.remove('leaving')});
 }catch(err){root.classList.remove('js');console.error(err)}
})();
