// Verifica end-to-end del riquadro mezzi. Richiede: stub su :8099 e Chrome headless su :9222
// (vedi docs/contatore-mezzi-setup.md → "Test"). Uso: node test/fleet-ui-check.js [dir-screenshot]
const { open } = require("./cdp");
const URL_ = "http://127.0.0.1:8099";
const OUT = process.argv[2] || "/out";
let fails = 0;
const check = (nome, ok, extra = "") => { console.log((ok ? "PASS " : "FAIL ") + nome + (ok ? "" : "  → " + extra)); if (!ok) fails++; };
const n = (p, i) => p.eval(`+document.querySelectorAll('.f-item')[${i}].querySelector('.f-n').textContent`);
const names = (p) => p.eval(`[...document.querySelectorAll('.f-name')].map(e=>e.textContent)`);

(async () => {
  await fetch(URL_ + "/__reset");
  const p = await open(URL_ + "/");
  await p.wait(500);

  // (a) + e persistenza
  await p.click(".f-item .f-inc"); await p.wait(500);
  check("a: + porta 12→13", (await n(p, 0)) === 13);
  const p2 = await open(URL_ + "/"); await p2.wait(500);
  check("a: dopo ricarica resta 13", (await n(p2, 0)) === 13);

  // (b) sincronizzazione tra postazioni (poll 12 s)
  await p.click(".f-item .f-inc"); await p.wait(13500);
  check("b: l'altra scheda vede 14 entro ~12 s", (await n(p2, 0)) === 14, String(await n(p2, 0)));

  // (c) − non scende sotto zero (anche a click rapidi) e il server concorda
  await p.eval(`for(let i=0;i<12;i++) document.querySelectorAll('.f-item')[1].querySelector('.f-dec').click()`);
  await p.wait(1000);
  const srv = await (await fetch(URL_ + "/api")).json();
  check("c: Misericordia a 0 in pagina", (await n(p, 1)) === 0);
  check("c: Misericordia a 0 sul server (nessun valore negativo)", srv.mezzi[1].n === 0, JSON.stringify(srv.mezzi[1]));

  // (d) reset con conferma
  await p.send("Page.bringToFront"); // Chrome rallenta i timer delle schede in background
  await p.click(".f-item .f-rst");
  check("d: primo click arma 'Sicuro?'", (await p.eval(`document.querySelector('.f-item .f-rst').textContent`)) === "Sicuro?");
  await p.wait(5200);
  check("d: dopo 4 s torna normale", (await p.eval(`document.querySelector('.f-item .f-rst').textContent`)) === "↺");
  check("d: nessun reset senza secondo click", (await n(p, 0)) === 14);
  await p.click(".f-item .f-rst"); await p.click(".f-item .f-rst"); await p.wait(700);
  check("d: secondo click azzera", (await n(p, 0)) === 0);
  check("d: mostra data/ora del reset", /reset \d\d\/\d\d \d\d:\d\d/.test(await p.eval(`document.querySelector('.f-reset').textContent`)));

  // (e) aggiunta mezzo; nome con HTML mostrato come testo
  await p.click("#fleet-add");
  await p.eval(`(()=>{const i=document.querySelector('.f-pop input'); i.value='<b>x</b>'; i.dispatchEvent(new Event('input'))})()`);
  await p.eval(`[...document.querySelectorAll('.f-pop button')].find(b=>b.textContent==='Aggiungi').click()`); await p.wait(700);
  check("e: aggiunto con nome letterale", (await names(p)).includes("<b>x</b>"), JSON.stringify(await names(p)));
  check("e: nessun elemento <b> iniettato", (await p.eval(`document.querySelectorAll('.f-name b').length`)) === 0);
  await p.click("#fleet-add");
  check("e: nome vuoto → Aggiungi disabilitato", await p.eval(`[...document.querySelectorAll('.f-pop button')].find(b=>b.textContent==='Aggiungi').disabled`));
  await p.click("#fleet-add");

  // (f) 5 mezzi: nessuna crescita oltre il vincolo, chiaro e scuro
  for (const nome of ["Terzo", "Quarto"]) await fetch(URL_ + "/api", { method: "POST", body: JSON.stringify({ op: "add", nome }) });
  await p.eval(`fleetRefresh()`); await p.wait(700);
  for (const [w, h, tema] of [[1920, 1080, "light"], [1920, 1080, "dark"], [1366, 768, "light"]]) {
    await p.viewport(w, h); await p.eval(`document.documentElement.dataset.theme=${JSON.stringify(tema)}`); await p.wait(300);
    const d = await p.eval(`({sh:document.documentElement.scrollHeight, ih:innerHeight, items:document.querySelectorAll('.f-item').length})`);
    console.log(`INFO ${w}x${h} ${tema}: ${d.items} mezzi, scrollHeight ${d.sh}/${d.ih}`);
    if (w === 1920) check(`f: ${w}x${h} ${tema} senza scroll con 5 mezzi`, d.sh <= d.ih, JSON.stringify(d));
    await p.shot(`${OUT}/fleet-${w}-${tema}.png`);
  }
  await p.viewport(1920, 1080); await p.eval(`document.documentElement.dataset.theme="light"`);

  // (g) Google non raggiungibile
  await fetch(URL_ + "/__fail?on=1");
  const prima = await names(p);
  await p.eval(`fleetRefresh()`); await p.wait(800);
  check("g: avviso visibile", /non raggiungibile/.test(await p.eval(`document.getElementById('fleet-status').textContent`)));
  check("g: ultimi numeri mantenuti", JSON.stringify(await names(p)) === JSON.stringify(prima));
  check("g: il resto della pagina funziona (link presenti)", (await p.eval(`document.querySelectorAll('.tile').length`)) > 10);
  await fetch(URL_ + "/__fail?on=0");
  await p.eval(`fleetRefresh()`); await p.wait(800);
  check("g: avviso sparisce al ripristino", (await p.eval(`document.getElementById('fleet-status').textContent`)) === "");

  // (h) modifica nome non persa dal refresh; "\" non ruba il focus; Esc annulla; Invio salva
  const tasto = (key) => p.eval(`document.querySelector('.f-item .f-edit').dispatchEvent(new KeyboardEvent('keydown',{key:${JSON.stringify(key)},bubbles:true}))`);
  await p.click(".f-item .f-name"); await p.wait(100);
  await p.eval(`document.querySelector('.f-item .f-edit').value='Nuovo nome'`);
  await tasto("\\");
  check("h: '\\' in un campo non sposta il focus sulla ricerca", await p.eval(`document.activeElement.classList.contains('f-edit')`));
  await p.eval(`fleetRefresh()`); await p.wait(800);
  check("h: refresh durante la modifica non cancella l'input", (await p.eval(`document.querySelector('.f-item .f-edit')&&document.querySelector('.f-item .f-edit').value`)) === "Nuovo nome");
  await tasto("Escape"); await p.wait(200);
  check("h: Esc annulla", (await names(p))[0] === "Croce A");
  await p.click(".f-item .f-name"); await p.wait(100);
  await p.eval(`document.querySelector('.f-item .f-edit').value='Croce Rossa'`);
  await tasto("Enter"); await p.wait(800);
  check("h: Invio salva il nuovo nome", (await names(p))[0] === "Croce Rossa", JSON.stringify(await names(p)));
  check("h: il nome è salvato sul server", (await (await fetch(URL_ + "/api")).json()).mezzi[0].nome === "Croce Rossa");

  // rimozione con conferma
  const prima2 = (await names(p)).length;
  await p.eval(`document.querySelectorAll('.f-item')[2].querySelector('.f-del').click()`);
  check("i: primo click su ✕ non rimuove", (await names(p)).length === prima2);
  await p.eval(`document.querySelectorAll('.f-item')[2].querySelector('.f-del').click()`); await p.wait(700);
  check("i: secondo click rimuove", (await names(p)).length === prima2 - 1);

  // (j) una lettura lenta partita prima del click non deve annullare il click
  const n0 = await n(p, 0);
  await fetch(URL_ + "/__delay?ms=1500");
  await p.eval(`(fleetRefresh(),0)`); await p.wait(200);
  await p.click(".f-item .f-inc"); await p.wait(2500);
  await fetch(URL_ + "/__delay?ms=0");
  check("j: la lettura lenta non riporta indietro il numero", (await n(p, 0)) === n0 + 1, `${await n(p, 0)} invece di ${n0 + 1}`);

  // (k) il focus da tastiera sopravvive ai ridisegni
  const attivo = () => p.eval(`(()=>{const a=document.activeElement;const it=a&&a.closest&&a.closest('.f-item');return it?it.dataset.id+'|'+a.className+'|'+a.textContent:''})()`);
  await p.eval(`document.querySelector('.f-item .f-inc').focus()`);
  await p.click(".f-item .f-inc"); await p.wait(700);
  check("k: dopo + il focus resta sul pulsante +", /^a\|f-btn f-inc\|/.test(await attivo()), await attivo());
  await p.eval(`document.querySelector('.f-item .f-rst').focus()`);
  await p.click(".f-item .f-rst"); await p.wait(200);
  check("k: dopo il primo click su ↺ il focus è ancora su ↺ ('Sicuro?')", /^a\|f-ico f-rst armed\|Sicuro\?/.test(await attivo()), await attivo());
  await p.click(".f-item .f-rst"); await p.wait(700);

  // (l) la ✕ di rimozione è piccola, nell'angolo, e armata resta dentro la card
  const g = await p.eval(`(()=>{const d=document.querySelector('.f-item .f-del').getBoundingClientRect(),c=document.querySelector('.f-item').getBoundingClientRect();return {w:d.width,h:d.height,top:d.top-c.top,right:c.right-d.right}})()`);
  check("l: ✕ piccola (≤ 20 px) nell'angolo in alto a destra", g.w <= 20 && g.h <= 20 && g.top <= 8 && g.right <= 8, JSON.stringify(g));
  await p.eval(`document.querySelector('.f-item .f-del').click()`);
  const g2 = await p.eval(`(()=>{const d=document.querySelector('.f-item .f-del').getBoundingClientRect(),c=document.querySelector('.f-item').getBoundingClientRect();return {armed:document.querySelector('.f-item .f-del').classList.contains('armed'),dentro:d.right<=c.right&&d.left>=c.left&&d.top>=c.top}})()`);
  check("l: armata ('Sicuro?') resta dentro la card", g2.armed && g2.dentro, JSON.stringify(g2));
  await p.wait(4500);

  check("console senza errori", p.logs.length === 0, p.logs.join(" | "));
  await p.close(); await p2.close();
  console.log(fails ? `\n${fails} controlli falliti` : "\nTutti i controlli superati");
  process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
