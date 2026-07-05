# EsculapioNET Website Implementation Plan

> ⚠️ **Documento storico (v1).** Descrive la costruzione iniziale del portale. Il sito
> è poi evoluto (tema scuro, ticker notizie, orologio, countdown turni, calcolatore età,
> badge intranet, card al posto delle pill). Per lo stato attuale vedi il `README.md` e
> `../specs/2026-06-21-esculapio-website-design.md`.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Creare `index.html` — portale link moderno per operatori 118/trasporti USL Toscana Centro, con ricerca in tempo reale e tre sezioni (Comune, Trasporti Urgenti, Emergenza Sanitaria).

**Architecture:** Singolo file `index.html` autocontenuto (HTML + CSS + JS). Link definiti come oggetto JS `SITE_DATA` in cima allo script — editabili senza conoscere HTML/CSS. Deploy su GitHub Pages: `https://fareyus.github.io/esculapio`.

**Tech Stack:** HTML5, CSS3 (custom properties, CSS Grid, Flexbox), JavaScript ES6 vanilla — zero dipendenze esterne.

---

### Task 1: HTML + CSS + dati + rendering

**Files:**
- Create: `esculapio/index.html`

Questo task crea il file completo con struttura HTML, CSS embedded, oggetto dati `SITE_DATA` con tutti i link, e le funzioni di rendering. Nessuna logica di ricerca ancora.

- [ ] **Step 1: Creare `index.html` con il contenuto completo**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EsculapioNET — Link Rapidi</title>
  <style>
    :root {
      --navy: #0d0d7a;
      --teal: #1a5f7a;
      --steel: #8090a0;
      --bg: #f5f7fa;
      --card: #ffffff;
      --text: #1a1a2e;
      --border: #e0e0ea;
      --hover-bg: #f0f0fa;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text);
      font-size: 15px;
      line-height: 1.5;
    }

    /* HEADER */
    header {
      background: var(--navy);
      color: #fff;
      padding: 10px 20px;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    }

    .header-inner {
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 1100px;
      margin: 0 auto;
    }

    .logo {
      font-size: 20px;
      font-weight: 800;
      background: #fff;
      color: var(--navy);
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      flex-shrink: 0;
      letter-spacing: -1px;
    }

    .header-title { font-size: 17px; font-weight: 700; }
    .header-sub   { font-size: 13px; opacity: 0.65; margin-left: 6px; }

    /* LAYOUT */
    .page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 20px 20px 48px;
    }

    /* SEARCH */
    .search-wrap { margin-bottom: 18px; }

    #search {
      width: 100%;
      padding: 11px 16px;
      font-size: 16px;
      border: 2px solid var(--border);
      border-radius: 8px;
      background: var(--card);
      outline: none;
      transition: border-color 0.18s;
    }

    #search:focus { border-color: var(--navy); }

    /* NO RESULTS */
    #no-results {
      text-align: center;
      padding: 48px 0;
      color: var(--steel);
      font-size: 15px;
    }

    .hidden { display: none !important; }

    /* CARD BASE */
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 14px;
    }

    .card-title {
      padding: 9px 16px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #fff;
    }

    .card-title.comune   { background: var(--steel); }
    .card-title.urgenti  { background: var(--navy); }
    .card-title.emergenza{ background: var(--teal); }

    /* PILLS (comune) */
    .pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 14px 16px;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      padding: 6px 14px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 20px;
      font-size: 14px;
      color: var(--text);
      text-decoration: none;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
      white-space: nowrap;
    }

    .pill:hover { background: var(--navy); color: #fff; border-color: var(--navy); }

    /* TWO-COLUMN GRID */
    .sections-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 14px;
    }

    /* LINK LIST */
    .link-list { list-style: none; }

    .link-list li a {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 9px 16px;
      color: var(--text);
      text-decoration: none;
      font-size: 14px;
      border-bottom: 1px solid var(--border);
      transition: background 0.13s, color 0.13s;
    }

    .link-list li:last-child a { border-bottom: none; }

    .link-list li a:hover { background: var(--hover-bg); color: var(--navy); }

    .link-list li a::after {
      content: "↗";
      color: var(--steel);
      font-size: 11px;
      flex-shrink: 0;
      margin-left: 10px;
    }

    /* ARCHIVIO (details/summary) */
    #archivio {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 10px;
      overflow: hidden;
    }

    #archivio summary {
      padding: 11px 16px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--steel);
      cursor: pointer;
      user-select: none;
      list-style: none;
    }

    #archivio summary::-webkit-details-marker { display: none; }
    #archivio summary::before { content: "▾  "; }
    #archivio[open] summary::before { content: "▴  "; }

    #archivio .link-list li a { font-size: 13px; }

    /* MOBILE */
    @media (max-width: 700px) {
      .sections-grid { grid-template-columns: 1fr; }
      .header-sub { display: none; }
    }
  </style>
</head>
<body>

<header>
  <div class="header-inner">
    <div class="logo">EN</div>
    <div>
      <span class="header-title">EsculapioNET</span>
      <span class="header-sub">Link Rapidi</span>
    </div>
  </div>
</header>

<div class="page">

  <div class="search-wrap">
    <input type="text" id="search" placeholder="🔍  Cerca tra i link..." autocomplete="off" spellcheck="false">
  </div>

  <div id="no-results" class="hidden">Nessun link trovato.</div>

  <!-- COMUNE -->
  <div class="card" id="section-comune">
    <div class="card-title comune">Comune</div>
    <div class="pills" id="links-comune"></div>
  </div>

  <!-- URGENTI + EMERGENZA -->
  <div class="sections-grid" id="sections-grid">
    <div class="card" id="section-urgenti">
      <div class="card-title urgenti">🚐 Trasporti Urgenti</div>
      <ul class="link-list" id="links-urgenti"></ul>
    </div>
    <div class="card" id="section-emergenza">
      <div class="card-title emergenza">🚑 Emergenza Sanitaria</div>
      <ul class="link-list" id="links-emergenza"></ul>
    </div>
  </div>

  <!-- ARCHIVIO -->
  <details id="archivio">
    <summary>Archivio link (poco usati)</summary>
    <ul class="link-list" id="links-archivio"></ul>
  </details>

</div>

<script>
const SITE_DATA = {
  comune: [
    { label: "Mail USL Centro",            url: "https://webmail.sanita.toscana.it/" },
    { label: "Mail EsculapioNET",          url: "https://outlook.office.com/mail/" },
    { label: "Rubrica Referenti",          url: "https://docs.google.com/spreadsheets/d/1H8Wfi8ccAZC7Pxi_HMVoefFpVOwKfx-bfPtoZnAVQ0Q/edit" },
    { label: "Rubrica Generale 118",       url: "https://docs.google.com/spreadsheets/d/1cDakO5InL3gx95SdUShPwQzJb4EJ5_yH/edit" },
    { label: "Mail Associazioni",          url: "https://docs.google.com/spreadsheets/d/1vvzBGbQW4WD_JToWUck5UkftfQABUR4donJxbMMWwFg/edit" },
    { label: "Turnazione Centrale 2026",   url: "https://docs.google.com/spreadsheets/d/16Zr8K8RBmMwz36aadtCGwlgUs5nl3WJuriIuNXd1oGY/edit" },
    { label: "Timbrature",                 url: "https://zgcloud.zeitgroup.com/" },
    { label: "Mappa Sinottica EU FI-PO",   url: "https://www.google.com/maps/d/u/0/viewer?hl=it&ll=43.749161033153946%2C11.223471242045049&z=11&mid=1sL_UeJEQEL1CO2WbPerkVYeALvjpGHY" },
    { label: "POT",                        url: "http://auth.sin.asf.it/login.php" },
    { label: "Cartellino",                 url: "https://zeitgroup2.oltremare.net/oltremare_php/mainnew_2.php?Id=99&prg=aruba" },
    { label: "Sigle e Turni Ambulanze 118",url: "http://intranet.118.asf.locale/index.php/acc-rapido/riga-1/turni-ambulanze-in-stand-by" },
  ],
  urgenti: [
    { label: "NRE - Controllo Certificati",   url: "https://ricettatrasporti.sanita.toscana.it/" },
    { label: "Lista Trasporti Entro-RT",      url: "https://docs.google.com/spreadsheets/d/127_ym_5atztWavdqCmabw4qVHaYdo2mbbFNKNcvWoqI/edit" },
    { label: "Lista Trasporti EXTRA-RT",      url: "https://docs.google.com/spreadsheets/d/1JOjGTEOhtfBt7vlznT-giyOKSul2Fo2LSOVdDgfK4Sg/edit" },
    { label: "Rubrica Trasporti Salma",       url: "https://docs.google.com/spreadsheets/d/1mMYw8xa1EZ15YK4cwn6Gw5hADZJ26Xvg3KHUKHpMdyo/edit" },
    { label: "Programmazione 1° Servizio",    url: "https://drive.google.com/drive/u/0/folders/11RbVBLZv6SRwvim9nR2FJZ0ZLYdsBnJ6" },
    { label: "Turnazione PRATO",              url: "https://drive.google.com/file/d/12gCfvRuQjvZ8JhAe3iktxNednAUaXaJP/view" },
    { label: "Mappa Funebre",                 url: "https://www.google.com/maps/d/u/0/viewer?mid=1gxSBjjf9NSwnSZP6SIP4UVVA5cv1m2lY&ll=43.8157963799819%2C11.372541918299275&z=10" },
    { label: "Tango",                         url: "https://drive.google.com/drive/folders/1wT5EIO0WB1u5y_Mlb3jAACSW_7yZPZcN" },
    { label: "Mezzi 118",                     url: "http://192.168.2.123:8080/dump118/" },
    { label: "Protocolli CO Firenze",         url: "https://drive.google.com/drive/u/0/folders/1A0L7jA6QkxEHzLL-hyQD50qI-2mwyIq0" },
    { label: "Regolamento Trasporti NRE",     url: "https://drive.google.com/drive/folders/1va72AvaAiL5XAIIMbeYGk5C1e2Su6hQw" },
  ],
  emergenza: [
    { label: "Homepage 118",                   url: "http://intranet.118.asf.locale/" },
    { label: "Medical Note Explorer",          url: "https://app118-firenze.uslcentro.toscana.it" },
    { label: "LifeDesk",                       url: "https://checklist118.uslcentro.toscana.it/Consegne.aspx" },
    { label: "DUMP - Guasti",                  url: "http://172.19.19.239/118/guasti.php" },
    { label: "DUMP - Ingressi Ospedali",       url: "http://172.19.19.239/118/dea_all.php" },
    { label: "Gestione Guasti",                url: "http://intranet.118.asf.locale/index.php/acc-rapido/3-riga/gestione-guasti-e-richieste-di-assistenza-tecnica" },
    { label: "S.A.R.A.",                       url: "https://sara.gruppo-informatico.com/Login.aspx" },
    { label: "Dati Post Chiusura Associazioni",url: "https://datipost118.uslcentro.toscana.it/wdodpc2/" },
    { label: "Codifica Regionale Targhe",      url: "https://docs.google.com/spreadsheets/d/1xYhNJWXpJO4gr1n8AutHg8GxYrp-lQhiw0b0Crm_xz4/edit" },
    { label: "Guida Inserimento Targhe",       url: "https://docs.google.com/presentation/d/1pWAmGdhAOI3tjbaHD-kUvryNpeF4iYnyekaWO2TkfkA/edit" },
    { label: "Tablet Rotti",                   url: "https://docs.google.com/spreadsheets/d/18GeLANtC43_U58puU05W99x3e3Rb6os3jeT6PrBjK7Q/edit" },
    { label: "TuConTi",                        url: "https://tuconti20.amm.telecomitalia.it/" },
    { label: "Cambio Password Dominio",        url: "https://cambiopassword118.uslcentro.toscana.it/" },
  ],
  archivio: [
    { label: "WebReparti",                  url: "https://trasportiurgenti.uslcentro.toscana.it/WebReparti/" },
    { label: "WebSer",                      url: "https://trasportiurgenti.uslcentro.toscana.it/WebSer/login.aspx" },
    { label: "Stradario Firenze",           url: "https://opendata.comune.fi.it/?q=metarepo/datasetinfo&id=11430710-56eb-4444-bd6f-c5433155afc5" },
    { label: "Calcolo Preventivo Trasporto",url: "https://docs.google.com/spreadsheets/d/1azZt3nlI9xe-CAygKVDIOY0RmcSSccRod72FGmw-e_Q/edit" },
    { label: "Calendario Notti",            url: "https://drive.google.com/drive/folders/1xp-ToYXze8TUoqQqogHv7v8WChZNQPmn" },
    { label: "Nottante",                    url: "https://webmail.aruba.it/" },
    { label: "Dispatcher Tablet Prova",     url: "https://demo.medicalnote.it" },
    { label: "Decodifica Codice Fiscale",   url: "https://sites.google.com/view/esculapio/link-rapidi/decodifica-codice-fiscale" },
    { label: "Progetto Tablet 118",         url: "https://drive.google.com/drive/folders/1AY0nKpE80wKFR9U8VHDagrNJxI5YsJwu" },
    { label: "Telefonia 118",               url: "https://docs.google.com/document/d/1i_X0fzFMihqFPBHOGHHBeECpWqSZ3_iYJSUjR43YUzw/edit" },
  ],
};

function renderLinks() {
  const comuneEl = document.getElementById('links-comune');
  SITE_DATA.comune.forEach(({ label, url }) => {
    const a = document.createElement('a');
    a.href = url;
    a.className = 'pill';
    a.textContent = label;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    comuneEl.appendChild(a);
  });
  renderList('links-urgenti',  SITE_DATA.urgenti);
  renderList('links-emergenza',SITE_DATA.emergenza);
  renderList('links-archivio', SITE_DATA.archivio);
}

function renderList(id, links) {
  const ul = document.getElementById(id);
  links.forEach(({ label, url }) => {
    const li = document.createElement('li');
    const a  = document.createElement('a');
    a.href = url;
    a.textContent = label;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    li.appendChild(a);
    ul.appendChild(li);
  });
}

renderLinks();
</script>
</body>
</html>
```

- [ ] **Step 2: Aprire `index.html` nel browser e verificare**

Aprire il file direttamente con `open esculapio/index.html` (macOS) oppure trascinarlo nel browser.

Verificare:
- Header navy con logo "EN" e titolo "EsculapioNET · Link Rapidi"
- Sezione Comune con 11 pills (badge)
- Due colonne affiancate: "Trasporti Urgenti" (navy) a sinistra, "Emergenza Sanitaria" (teal) a destra
- 11 link in Urgenti, 13 in Emergenza
- Accordion "Archivio link" collassato con 10 link — aprirlo e verificare che mostri i link
- Tutti i link hanno l'icona ↗ a destra
- Barra di ricerca presente ma non ancora funzionante
- Su mobile (DevTools → 375px): colonne impilate in verticale

- [ ] **Step 3: Commit**

```bash
cd /Users/mirko/Desktop/CLAUDE/esculapio
git init
git add index.html
git commit -m "feat: portale link EsculapioNET - struttura e dati completi"
```

---

### Task 2: Ricerca in tempo reale

**Files:**
- Modify: `esculapio/index.html` — aggiungere le funzioni di ricerca al blocco `<script>` esistente

- [ ] **Step 1: Aggiungere le funzioni di ricerca**

Nel blocco `<script>`, dopo la riga `renderLinks();`, aggiungere:

```javascript
function filterLinks(q) {
  const noResults = document.getElementById('no-results');

  if (!q) {
    showAll();
    document.getElementById('archivio').removeAttribute('open');
    noResults.classList.add('hidden');
    return;
  }

  let total = 0;

  // Comune: filtra le pills
  const comuneSection = document.getElementById('section-comune');
  let n = 0;
  comuneSection.querySelectorAll('.pill').forEach(el => {
    const show = el.textContent.toLowerCase().includes(q);
    el.style.display = show ? '' : 'none';
    if (show) n++;
  });
  comuneSection.style.display = n ? '' : 'none';
  total += n;

  // Urgenti e Emergenza
  const urgenti  = filterList('links-urgenti', q);
  const emergenza = filterList('links-emergenza', q);
  document.getElementById('section-urgenti').style.display  = urgenti  ? '' : 'none';
  document.getElementById('section-emergenza').style.display = emergenza ? '' : 'none';
  document.getElementById('sections-grid').style.display = (urgenti || emergenza) ? '' : 'none';
  total += urgenti + emergenza;

  // Archivio: si apre automaticamente se ha risultati
  const arch    = filterList('links-archivio', q);
  const archivio = document.getElementById('archivio');
  archivio.style.display = arch ? '' : 'none';
  if (arch) { archivio.setAttribute('open', ''); total += arch; }

  noResults.classList.toggle('hidden', total > 0);
}

function filterList(listId, q) {
  let n = 0;
  document.getElementById(listId).querySelectorAll('li').forEach(li => {
    const show = li.querySelector('a').textContent.toLowerCase().includes(q);
    li.style.display = show ? '' : 'none';
    if (show) n++;
  });
  return n;
}

function showAll() {
  ['section-comune','section-urgenti','section-emergenza','archivio','sections-grid'].forEach(id => {
    document.getElementById(id).style.display = '';
  });
  document.querySelectorAll('.pill, #links-urgenti li, #links-emergenza li, #links-archivio li').forEach(el => {
    el.style.display = '';
  });
}

document.getElementById('search').addEventListener('input', e => {
  filterLinks(e.target.value.trim().toLowerCase());
});
```

- [ ] **Step 2: Verificare la ricerca nel browser**

Ricaricare `index.html` nel browser e testare:

| Cosa digitare | Risultato atteso |
|---------------|-----------------|
| `mail` | Restano visibili: "Mail USL Centro", "Mail EsculapioNET", "Mail Associazioni" nelle pills Comune. Sezioni Urgenti/Emergenza/Archivio senza match scompaiono. |
| `nre` | Restano: "NRE - Controllo Certificati" in Urgenti, "Regolamento Trasporti NRE" in Urgenti. |
| `tablet` | Restano: "Tablet Rotti" in Emergenza + "Dispatcher Tablet Prova" e "Progetto Tablet 118" in Archivio (accordion si apre automaticamente). |
| `xyz123` | Tutte le sezioni scompaiono, compare "Nessun link trovato." |
| *(cancella tutto)* | Tutto torna visibile, Archivio si richiude. |

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: ricerca link in tempo reale con auto-espansione archivio"
```

---

### Task 3: Setup GitHub Pages

**Files:**
- Create: `esculapio/.gitignore`

- [ ] **Step 1: Creare `.gitignore`**

```
.DS_Store
```

- [ ] **Step 2: Commit .gitignore**

```bash
git add .gitignore
git commit -m "chore: aggiungi .gitignore"
```

- [ ] **Step 3: Creare il repo su GitHub e fare push**

```bash
# Autenticarsi se necessario (aprirà il browser)
gh auth login

# Creare repo pubblico e fare push
gh repo create esculapio --public --source=. --remote=origin --push
```

Output atteso:
```
✓ Created repository fareyus/esculapio on GitHub
✓ Added remote https://github.com/fareyus/esculapio.git
✓ Pushed commits to https://github.com/fareyus/esculapio.git
```

- [ ] **Step 4: Abilitare GitHub Pages**

```bash
gh api repos/fareyus/esculapio/pages \
  --method POST \
  -f build_type=legacy \
  -f source.branch=main \
  -f source.path=/
```

Output atteso: JSON con `"html_url": "https://fareyus.github.io/esculapio"`.

Attendere 1-2 minuti, poi aprire: `https://fareyus.github.io/esculapio`

- [ ] **Step 5: Verifica finale su GitHub Pages**

Aprire `https://fareyus.github.io/esculapio` nel browser e verificare:
- Pagina carica correttamente (non 404)
- Tutti i link sono presenti
- Ricerca funziona
- Layout mobile corretto (DevTools → 375px)

---

## Come aggiornare i link in futuro

Aprire `index.html`, trovare il blocco `const SITE_DATA = {` e modificare l'array corrispondente. Esempio per aggiungere un link in Comune:

```javascript
comune: [
  { label: "Mail USL Centro", url: "https://webmail.sanita.toscana.it/" },
  { label: "Nuovo Link",      url: "https://esempio.it/" },   // ← aggiunto
  ...
],
```

Poi:
```bash
git add index.html
git commit -m "update: aggiunto Nuovo Link in Comune"
git push
```

GitHub Pages si aggiorna automaticamente in ~30 secondi.
