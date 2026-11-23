const WA='919121052932';
document.querySelector('.burger').onclick=e=>{const u=document.querySelector('.nav ul');u.classList.toggle('open');e.target.setAttribute('aria-expanded',u.classList.contains('open'))};
document.querySelectorAll('form[data-wa]').forEach(f=>f.onsubmit=e=>{e.preventDefault();
 const d=new FormData(f);let m=f.dataset.wa+'\n';for(const[k,v]of d)if(v)m+=`${k}: ${v}\n`;
 window.open(`https://wa.me/${WA}?text=${encodeURIComponent(m)}`,'_blank','noopener');
 const ok=f.querySelector('.ok');if(ok)ok.style.display='block';f.reset()});
