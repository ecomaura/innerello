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
