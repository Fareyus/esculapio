# EsculapioNET — Portale link rapidi

Portale di link operativi per gli operatori della Centrale 118 Firenze-Prato (USL Toscana Centro).
Disponibile su **[fareyus.github.io/esculapio](https://fareyus.github.io/esculapio)**.

## Funzionalità

- **Link rapidi** suddivisi in sezioni: Comune, Trasporti Urgenti, Emergenza Sanitaria, Archivio
- **Ricerca in tempo reale** (scorciatoia `\`) — filtra tutti i link istantaneamente
- **Ticker notizie** La Nazione Firenze/Prato — aggiornato automaticamente ogni 15 minuti
- **Countdown fine turno** per Ordinari ed Emergenza, unificato quando coincidono
- **Calcolatore età paziente** — inserisci l'anno di nascita e premi Invio
- **Tema chiaro/scuro** con memoria locale
- **Badge intranet** sui link raggiungibili solo dalla rete interna 118

## Come aggiungere o modificare un link

Apri `index.html` e trova il blocco `const SITE_DATA = {` in cima allo script.
Ogni sezione è un array di oggetti `{ label, url }`. Aggiungi `intranet: true` per mostrare il badge.

```js
const SITE_DATA = {
  comune: [
    { label: "Mail USL Centro", url: "https://webmail.sanita.toscana.it/" },
    { label: "Nuovo Link",      url: "https://esempio.it/" },        // ← aggiunto
    { label: "Link Intranet",   url: "http://intranet.locale/",  intranet: true },
  ],
  urgenti:   [ ... ],
  emergenza: [ ... ],
  archivio:  [ ... ],   // link poco usati, collassati di default
};
```

Dopo la modifica:

```bash
git add index.html
git commit -m "update: descrizione della modifica"
git push
```

GitHub Pages si aggiorna in circa 30 secondi.

## Struttura

```
index.html   # unico file del sito — HTML, CSS e JS incorporati, zero dipendenze
logo.png     # logo EsculapioNET usato nell'header
robots.txt   # noindex — pagina a uso interno
```

## Note tecniche

- **Ticker notizie:** usa tre proxy in cascata (rss2json → allorigins → corsproxy.io) per aggirare le restrizioni CORS sui feed RSS de La Nazione.
- **Link intranet:** raggiungibili solo dalla rete interna 118 (`intranet.118.asf.locale`, `172.19.19.x`, `192.168.x.x`).
- **Turni Ordinari:** Mattina 06:50–14:00 · Pomeriggio 14:00–20:00 · Notte 20:00–07:00
- **Turni Emergenza:** Mattina 07:00–13:00 · Pomeriggio 13:00–20:00 · Notte 20:00–07:00
