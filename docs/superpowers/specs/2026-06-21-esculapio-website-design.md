# EsculapioNET — Design Spec

**Data:** 2026-06-21 (spec iniziale) · **Aggiornata:** 2026-07-06
**Progetto:** Modernizzazione del portale link interni EsculapioNET
**Sorgente originale:** https://sites.google.com/view/esculapio/home
**Hosting target:** GitHub Pages — `https://fareyus.github.io/esculapio`

> Questo documento descrive lo **stato attuale** del sito. La versione iniziale (v1)
> prevedeva palette chiara, pill per il Comune e ricerca in alto; il piano di
> implementazione storico è in `../plans/2026-06-21-esculapio-website.md`.

---

## Contesto

Portale di link rapidi per operatori di Centrale USL Toscana Centro (118 / trasporti sanitari urgenti). Due profili utente distinti condividono la stessa pagina:

- **Operatori Trasporti Urgenti** (ex-ordinari) — usano prevalentemente i link della sezione Trasporti Urgenti
- **Operatori Emergenza Sanitaria** — usano prevalentemente i link della sezione Emergenza Sanitaria

Entrambi usano un sottoinsieme di link comuni.

---

## Architettura

**Tecnologia:** singolo file `index.html` con CSS e JavaScript incorporati. Nessuna dipendenza esterna, nessun build step. Funziona aprendo il file in locale e su GitHub Pages senza differenze.

**Dati:** i link sono definiti come oggetto JavaScript `SITE_DATA` in cima al blocco `<script>`, facilmente editabile senza conoscere HTML/CSS. Per aggiungere/modificare un link: editare l'array corrispondente e fare push su GitHub.

```js
const SITE_DATA = {
  comune:    [ { label: "...", url: "..." }, ... ],
  urgenti:   [ { label: "...", url: "...", intranet: true }, ... ],
  emergenza: [ { label: "...", url: "..." }, ... ],
  archivio:  [ { label: "...", url: "..." }, ... ]
};
```

`intranet: true` mostra un badge "intranet" sulla card (link raggiungibile solo dalla rete interna 118).

---

## Layout

```
┌────────────────────────────────────────────────────────────┐
│  [Logo EsculapioNET]        12:34:56 · lunedì 6 luglio  ◐  │  header (panel)
├────────────────────────────────────────────────────────────┤
│  🗞 FI · PO │  ‹‹ ticker notizie La Nazione scorrevole ›› │  ticker
├────────────────────────────────────────────────────────────┤
│  Comune ─────────────────────────────────────────────────  │
│  [card] [card] [card] [card] ...                            │
├────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐ ┌──────────────────────────────┐ │
│  │ 🚐 TRASPORTI URGENTI │ │ 🚑 EMERGENZA SANITARIA       │ │
│  │ [card] [card] ...    │ │ [card] [card] ...            │ │
│  └──────────────────────┘ └──────────────────────────────┘ │
├────────────────────────────────────────────────────────────┤
│  🩺 Età paziente [____] [Calcola]   Ordinari 01:26:04 …    │  age + countdown
├────────────────────────────────────────────────────────────┤
│  ▾ Archivio link  (collassato per default)                 │
├────────────────────────────────────────────────────────────┤
│  🔍  Cerca un link…                                    \   │  search bar
└────────────────────────────────────────────────────────────┘
```

Su mobile (< 600px): colonna singola, sezioni impilate verticalmente, orologio nascosto.

---

## Componenti dinamici

### Orologio e data
Nell'header, aggiornati ogni secondo (`toLocaleTimeString`/`toLocaleDateString` in `it-IT`).

### Ticker notizie
Feed RSS La Nazione **Firenze** e **Prato**, uniti e ordinati per data (max 16 titoli), scorrimento orizzontale continuo (in pausa all'hover). Refresh ogni 15 minuti.
Tre proxy in cascata per aggirare il CORS: **rss2json** (JSON) → **allorigins** (XML, gestisce anche `data:base64`) → **corsproxy.io** (testo grezzo). Se tutti falliscono mostra "Notizie Firenze/Prato non disponibili".

### Countdown fine turno
Due timer accanto al calcolatore età, aggiornati al secondo:
- **Ordinari:** Mattina 06:50–14:00 · Pomeriggio 14:00–20:00 · Notte 20:00–07:00
- **Emergenza:** Mattina 07:00–13:00 · Pomeriggio 13:00–20:00 · Notte 20:00–07:00

Quando i due countdown coincidono (di notte, entrambi verso le 07:00) vengono unificati in un unico timer "Ordinari/Emergenza".

### Calcolatore età paziente
Input anno di nascita + bottone "Calcola" (o Invio). Restituisce l'età (`anno corrente − nascita`). Gestisce anni a 2 cifre (disambigua 1900+ / 2000+) e casi limite con messaggi ironici ("Non lo so Rick...", "… è morto.").

### Tema chiaro/scuro
Toggle `◐` nell'header. Chiaro di default (`data-theme="light"`), preferenza salvata in `localStorage` (`esc-theme`).

---

## Sezioni e link

> Elenco di riferimento. La fonte di verità è l'oggetto `SITE_DATA` in `index.html`.

### Comune (10)
Mail USL Centro · Mail EsculapioNET · Rubrica Referenti · Mail Associazioni · Turnazione Centrale 2026 · Timbrature · Mappa Sinottica EU FI-PO · POT · Cartellino · Sigle e Turni Ambulanze 118 `intranet`

### 🚐 Trasporti Urgenti (11)
NRE - Controllo Certificati · Lista Trasporti Entro-RT · Lista Trasporti EXTRA-RT · Rubrica Trasporti Salma · Programmazione 1° Servizio · Turnazione PRATO · Mappa Funebre · Tango · Mezzi 118 `intranet` · Protocolli CO Firenze · Regolamento Trasporti NRE

### 🚑 Emergenza Sanitaria (12)
Homepage 118 `intranet` · Medical Note Explorer · LifeDesk · DUMP - Guasti `intranet` · Gestione Guasti `intranet` · S.A.R.A. · Dati Post Chiusura Associazioni · Codifica Regionale Targhe · Guida Inserimento Targhe · Tablet Rotti · TuConTi · Cambio Password Dominio

### ▾ Archivio link (collassato)
Rubrica Generale 118 · WebReparti · WebSer · Stradario Firenze · Calcolo Preventivo Trasporto · Calendario Notti · Nottante · Dispatcher Tablet Prova · Decodifica Codice Fiscale · Progetto Tablet 118 · Telefonia 118

---

## Ricerca

- Barra di ricerca in fondo alla pagina; scorciatoia da tastiera `\` per il focus, `Esc` per svuotare
- Filtra in tempo reale (input event) su `label` (case-insensitive, match parziale)
- Filtra i link in tutte le sezioni, incluso l'Archivio (che si espande automaticamente se ha match)
- Gruppi senza match vengono nascosti (`display:none`)
- Se nessun link corrisponde: messaggio "Nessun link trovato. Prova un altro termine."
- Con ricerca vuota: comportamento normale, Archivio richiuso

---

## Visual Design

**Palette (chiaro di default, con tema scuro completo via `:root` / override light via `[data-theme="light"]`):**

| Token | Chiaro (default) | Scuro |
|-------|------------------|-------|
| `--bg` | `#eceef4` | `#090a1e` |
| `--panel` | `#ffffff` | `#11132e` |
| `--text` | `#0a0c2a` | `#e9ebf7` |
| `--navy` | `#000066` | `#000066` |
| `--amber` (badge intranet) | `#9a6a06` | `#e0a93b` |
| `--c-urgenti` / `--c-emergenza` | `#1a3a8a` / `#1a5f7a` | `#7b9ce8` / `#4ab5c8` |

**Typography:** stack di sistema (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, …`), font monospace di sistema per orologio/countdown/contatori — nessuna font esterna, caricamento istantaneo.

**Componenti:**
- Header: panel con logo, orologio+data e toggle tema
- Ticker: barra scorrevole con etichetta "🗞 FI · PO"
- Sezioni: intestazione con titolo, contatore link e linea di separazione
- Link: **card** uniformi con glyph (iniziali del nome) + etichetta + eventuale badge `intranet`; hover con sollevamento e barra gradiente a sinistra
- Trasporti Urgenti / Emergenza: due colonne affiancate su desktop
- Barra età paziente + countdown turni
- Archivio: accordion `<details><summary>` con le stesse card
- Search bar in fondo con `<kbd>\</kbd>`
- Mobile (< 600px): colonna singola, orologio nascosto
- `prefers-reduced-motion`: disattiva le transizioni

---

## Privacy / indicizzazione

Pagina a uso interno: `robots.txt` con `noindex` e meta tag che escludono i crawler AI (GPTBot, ClaudeBot, Google-Extended, Perplexity, CCBot, Cohere, ecc.).

---

## File del progetto

```
esculapio/
├── index.html    # unico file del sito (HTML + CSS + JS)
├── logo.png      # logo nell'header
├── favicon.png   # icona scheda browser
├── robots.txt    # noindex
├── LICENSE       # CC BY-NC-ND 4.0
└── docs/superpowers/
    ├── specs/2026-06-21-esculapio-website-design.md   # questo file
    └── plans/2026-06-21-esculapio-website.md          # piano v1 (storico)
```

Deploy su GitHub Pages: `https://fareyus.github.io/esculapio`
