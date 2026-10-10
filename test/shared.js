/* Logica condivisa dalle pagine di test: tema, orologio, turni, età, link, ricerca */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=document.documentElement;
try{const s=localStorage.getItem("esc-theme"); if(s) root.dataset.theme=s;}catch(e){}
function toggleTheme(){root.dataset.theme=root.dataset.theme==="dark"?"light":"dark";try{localStorage.setItem("esc-theme",root.dataset.theme)}catch(e){}}
$$("[data-theme-btn]").forEach(b=>b.onclick=toggleTheme);

function makeLink({label,url,intranet,dashboard}){
  const a=document.createElement("a");a.className="link";a.href=url;a.target="_blank";a.rel="noopener noreferrer";
  let host="";try{host=new URL(url).hostname.replace(/^www\./,"")}catch(e){}
  a.dataset.s=(label+" "+host).toLowerCase();
  a.innerHTML=`<span class="n"></span>`;$(".n",a).textContent=label;
  if(intranet||dashboard){const b=document.createElement("span");b.className="badge "+(intranet?"lan":"dash");b.textContent=intranet?"lan":"dashboard";a.appendChild(b);}
  return a;
}
$$("[data-links]").forEach(el=>(SITE_DATA[el.dataset.links]||[]).forEach(l=>el.appendChild(makeLink(l))));
$$("[data-count]").forEach(el=>el.textContent=(SITE_DATA[el.dataset.count]||[]).length);

/* ricerca: "\" per focus, Esc per pulire */
const q=$("[data-search]");
if(q){
  q.addEventListener("input",()=>{const v=q.value.trim().toLowerCase();
    $$(".link").forEach(l=>l.classList.toggle("hide",!!v&&!l.dataset.s.includes(v)));
    $$("details[data-arch]").forEach(d=>{if(v)d.open=true});
    $$("[data-section]").forEach(s=>s.classList.toggle("hide",!!v&&!$$(".link:not(.hide)",s).length));});
  addEventListener("keydown",e=>{if(e.key==="\\"&&document.activeElement!==q){e.preventDefault();q.focus()}
    if(e.key==="Escape"&&document.activeElement===q){q.value="";q.dispatchEvent(new Event("input"));q.blur()}});
}

/* età paziente */
$$("[data-age]").forEach(w=>{
  const i=$("input",w),r=$(".res",w);
  function go(){const raw=i.value.trim(),oggi=new Date().getFullYear();
    if(!raw){r.textContent="Inserisci un anno";return}
    const n=parseInt(raw,10);if(isNaN(n)||n<0){r.textContent="Anno non valido";return}
    if(/^\d{1,2}$/.test(raw)){const a=1900+n,b=2000+n;
      r.textContent=b>oggi?`${oggi-a} anni`:`${oggi-a} anni (${a}) o ${oggi-b} (${b})`;return}
    r.textContent=n>oggi?"Anno futuro":n<1900?"Anno non valido":`${oggi-n} anni`;}
  $("button",w).onclick=go;i.addEventListener("keydown",e=>{if(e.key==="Enter")go()});
});

/* turni */
const SHIFT={urg:[7,14,20],eme:[7,13,20]};
function shiftInfo(d,b){const t=d.getHours()*3600+d.getMinutes()*60+d.getSeconds(),B=b.map(h=>h*3600),D=86400;let s,e;
  if(t<B[0]){s=B[B.length-1]-D;e=B[0]}else{let i=B.length-1;while(i>0&&t<B[i])i--;s=B[i];e=i===B.length-1?B[0]+D:B[i+1]}
  const hh=x=>String(Math.floor(((x%D)+D)%D/3600)).padStart(2,"0");
  return{rem:e-t,p:(t-s)/(e-s),win:`${hh(s)}–${hh(e)}`}}
const hms=s=>[Math.floor(s/3600),Math.floor(s%3600/60),s%60].map(x=>String(x).padStart(2,"0")).join(":");
function tick(){const d=new Date();
  $$("[data-clock]").forEach(e=>e.textContent=d.toLocaleTimeString("it-IT"));
  $$("[data-date]").forEach(e=>e.textContent=d.toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"}));
  for(const k of["urg","eme"]){const x=shiftInfo(d,SHIFT[k]);
    $$(`[data-cd="${k}"]`).forEach(e=>e.textContent=hms(x.rem));
    $$(`[data-win="${k}"]`).forEach(e=>e.textContent=x.win);
    $$(`[data-bar="${k}"]`).forEach(e=>e.style.transform=`scaleX(${x.p.toFixed(4)})`);}}
tick();setInterval(tick,1000);
