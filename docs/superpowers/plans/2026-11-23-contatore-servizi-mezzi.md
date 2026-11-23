# Contatore servizi mezzi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sostituire il calcolatore età con un riquadro "Servizi mezzi" condiviso tra 3-4 postazioni, con i dati in un foglio Google.

**Architecture:** Un foglio Google con una riga per mezzo; un Apps Script (web app) applica operazioni (`inc`, `dec`, `reset`, `add`, `remove`, `rename`) sotto `LockService` e risponde sempre con lo stato completo. `index.html` mostra lo stato, invia le operazioni e ricontrolla ogni 12 s. La logica delle operazioni è una funzione pura, testata in Node e riusata da un server stub per verificare la UI.

**Tech Stack:** HTML/CSS/JS vanilla in `index.html` (nessuna dipendenza), Google Apps Script, Node (`node --test`) solo per i test, Playwright MCP per la verifica visiva.

**Spec:** `docs/superpowers/specs/2026-11-23-contatore-servizi-mezzi-design.md`

## Global Constraints

- Il sito resta un solo `index.html` autocontenuto, senza librerie né build.
- Nessuno scroll: con 5 mezzi la pagina sta in una schermata a 1366×768.
- Design esistente: teal unico accento, numeri `mono` tabellari, niente side-stripe border >1px, `prefers-reduced-motion` rispettato.
- Conferma (secondo click entro 4 s) solo su reset e rimozione; − e + immediati; il contatore non scende sotto 0.
- Il client invia la variazione, mai il valore finale; il server risponde sempre con lo stato completo.
- Ricontrollo ogni 12 s, sospeso a scheda nascosta; errore di rete = avviso discreto, il resto del portale resta intatto.
- Nomi dei mezzi sempre inseriti nel DOM con `textContent`, mai `innerHTML`.
- Si rimuove il calcolatore età (HTML, CSS `.age-*`, JS); `.util` e `.u-lbl` restano e vengono riusati.

## Review Focus

- Due `inc` quasi simultanei da postazioni diverse: entrambi contati (test in Task 1, lock in `doPost`).
- `dec` con contatore a 0: resta 0 (Task 1).
- Nome vuoto, solo spazi o oltre 30 caratteri: rifiutato o troncato (Task 1); nome con `<script>` mostrato come testo (Task 3).
- Risposta non JSON (pagina di login Google se lo script non è pubblico) o rete assente: avviso nel riquadro, ultimi numeri mantenuti (Task 3).
- Il ricontrollo periodico arriva mentre si modifica un nome o è in attesa una conferma: l'input e lo stato di conferma non si perdono (Task 3).
- `reset`/`remove`/`inc` su un mezzo già rimosso da un'altra postazione: nessun errore, stato aggiornato (Task 1).

---

## File Structure

- Create `apps-script/Code.gs` — logica pura `applyOp` + `doGet`/`doPost`/`inizializza` (parte Google).
- Create `apps-script/Code.test.js` — test Node di `applyOp`.
- Create `test/fleet-stub.js` — server locale che serve `index.html` con l'URL API puntato a sé stesso e usa `applyOp` in memoria.
- Modify `index.html` — rimozione età; riquadro mezzi (CSS, HTML, JS).
- Modify `README.md`, `PRODUCT.md` — via età paziente, aggiunto contatore.
- Create `docs/contatore-mezzi-setup.md` — passi per creare foglio e pubblicare lo script.

---

### Task 1: Logica delle operazioni (Apps Script, testata in Node)

**Files:**
- Create: `apps-script/Code.gs`
- Test: `apps-script/Code.test.js`

**Interfaces:**
- Produces: `applyOp(stato: Mezzo[], op: {op: string, id?: string, nome?: string}, ora: Date) -> Mezzo[]` con `Mezzo = {id: string, nome: string, n: number, reset: string|null}` (`reset` ISO 8601). Non muta l'input. Esportata con `if (typeof module !== "undefined") module.exports = { applyOp };` in fondo a `Code.gs`.
- Produces: `NOME_MAX = 30`.

- [ ] **Step 1: Scrivere i test in `Code.test.js`** (`node:test`, `require("./Code.gs")`), tutti con `ora = new Date("2026-11-23T10:00:00Z")`:
  - `add` con `nome:"  Croce A "` aggiunge `{nome:"Croce A", n:0, reset:null}` con id non vuoto; due `add` nello stesso istante danno id diversi.
  - `add` con nome `""` o `"   "` lascia lo stato invariato; con 40 caratteri tronca a 30.
  - `inc` due volte in sequenza su stesso id → `n === 2`.
  - `dec` su `n:0` → `n === 0`; su `n:3` → `2`.
  - `reset` → `n === 0` e `reset === ora.toISOString()`.
  - `rename` con nome valido cambia nome, con nome vuoto no.
  - `remove` toglie la riga; `inc`/`reset`/`remove`/`rename` con id inesistente restituiscono uno stato uguale all'input, senza eccezioni.
  - `applyOp` non muta l'array passato (`deepEqual` con copia fatta prima).
- [ ] **Step 2: Eseguire** `node --test apps-script/` — atteso: FAIL (`applyOp` non definita).
- [ ] **Step 3: Implementare `applyOp` in `apps-script/Code.gs`**, funzione pura e senza dipendenze Google; id generato da `"m" + ora.getTime().toString(36)` con suffisso incrementale se già presente.
- [ ] **Step 4: Eseguire** `node --test apps-script/` — atteso: tutti PASS.
- [ ] **Step 5: Aggiungere in `Code.gs` la parte Google** (non testabile in Node, fuori dal ramo `module.exports`): `leggiStato(): Mezzo[]` e `scriviStato(stato)` sul foglio `Mezzi` (colonne `id, nome, n, reset`, riga 1 intestazione); `doGet()` → `ContentService` JSON `{ok:true, mezzi}`; `doPost(e)` → legge `JSON.parse(e.postData.contents)`, prende `LockService.getScriptLock().waitLock(10000)`, `leggiStato` → `applyOp` → `scriviStato`, rilascia il lock in `finally`, risponde `{ok:true, mezzi}`; su eccezione `{ok:false, errore:String}`; `inizializza()` crea il foglio con le intestazioni e due mezzi "Mezzo 1" e "Mezzo 2".
- [ ] **Step 6: Commit** — `git add apps-script && git commit -m "feat: logica contatore mezzi (Apps Script) con test"`

---

### Task 2: Via l'età, riquadro mezzi statico

**Files:**
- Modify: `index.html` — CSS ~righe 215-231 (togliere `.age-input`, `.age-btn`, `.age-result`), HTML ~righe 352-357, JS ~righe 561-586 (blocco "età paziente").
- Create: `test/fleet-stub.js`

**Interfaces:**
- Consumes: `applyOp` da `apps-script/Code.gs`.
- Produces: in `index.html`, `renderFleet(mezzi: Mezzo[]): void` che ricostruisce le righe dentro `#fleet-list` (id riga `data-id`); `formatReset(iso: string|null): string` → `"dd/MM HH:mm"` in ora locale, `"mai"` se `null`.
- Produces: `test/fleet-stub.js` — `node test/fleet-stub.js` serve su `http://localhost:8099`: `/` = `index.html` con la costante `FLEET_API` sostituita da `http://localhost:8099/api`; `/api` GET e POST (corpo JSON) con stato in memoria iniziale `[{Croce A, 12},{Misericordia, 9}]`, header CORS `*`, e rotta `/api?fail=1` che risponde HTML (per provare l'errore).

- [ ] **Step 1: Rimuovere** il calcolatore età (HTML, CSS `.age-*`, IIFE JS). Tenere `.util` e `.u-lbl`.
- [ ] **Step 2: Aggiungere nel posto lasciato libero** `<section class="util fleet" aria-label="Servizi mezzi">` con etichetta `🚑 Servizi mezzi`, `#fleet-list`, pulsante `#fleet-add` "+ mezzo", `#fleet-status` (`aria-live="polite"`). Riga mezzo: nome (`.f-name`), `[−] numero [+]` (`.f-n mono`, numero grande), `reset: <formatReset>` piccolo (`.f-reset`), pulsanti reset ↺ e rimuovi ✕. Costante `const FLEET_API = "";` in cima allo script.
- [ ] **Step 3: CSS compatto** nei token esistenti: riga alta ≤ 40 px, bordi `--line`, accento `--brand`/teal, `:focus-visible` visibile, bersagli click ≥ 32 px.
- [ ] **Step 4: Scrivere `test/fleet-stub.js`** come da Interfaces; `FLEET_API` vuoto = riquadro con messaggio "Contatore non configurato".
- [ ] **Step 5: Verificare** — avviare `node test/fleet-stub.js`, aprire `http://localhost:8099` con Playwright, screenshot a 1366×768 (chiaro e scuro): atteso nessuno scroll, nessun errore in console, il blocco età non c'è più.
- [ ] **Step 6: Commit** — `git add index.html test/fleet-stub.js && git commit -m "feat: riquadro servizi mezzi (statico), rimosso calcolo età"`

---

### Task 3: Sincronizzazione e interazioni

**Files:**
- Modify: `index.html` (JS del riquadro)

**Interfaces:**
- Consumes: `renderFleet`, `formatReset` (Task 2); protocollo di Task 1 (`GET FLEET_API` → `{ok, mezzi}`; `POST FLEET_API` con `Content-Type: text/plain` e corpo `JSON.stringify({op,id?,nome?})` → `{ok, mezzi}`).
- Produces: `fleetSend(op: {op:string,id?:string,nome?:string}): Promise<void>` (invia, applica la risposta con `renderFleet`, o mostra l'avviso); `fleetRefresh(): Promise<void>`; `fleetConfirm(btn: HTMLElement, azione: () => void): void` (primo click arma il pulsante per 4 s con testo "Sicuro?", secondo click esegue).

- [ ] **Step 1: Implementare `fleetRefresh` e il polling** `setInterval` 12 s, saltato se `document.hidden`, con refresh immediato su `visibilitychange`. Risposta non JSON, `ok:false` o errore di rete → `#fleet-status` "Contatore non raggiungibile — numeri non aggiornati", ultimi numeri mantenuti; ripristino automatico al successo. Timeout 8 s con `AbortController`.
- [ ] **Step 2: Collegare − e +** a `fleetSend({op:"dec"|"inc", id})`, subito, con numero aggiornato appena arriva la risposta; durante l'invio il pulsante è disabilitato.
- [ ] **Step 3: Collegare reset e rimozione** tramite `fleetConfirm`; l'armatura sopravvive a un `renderFleet` (stato per `id` fuori dal DOM, es. `Map`).
- [ ] **Step 4: Nome modificabile**: click sul nome → `<input maxlength="30">`, Invio o blur salva con `rename`, Esc annulla; un `renderFleet` non sostituisce l'input in modifica.
- [ ] **Step 5: Menu "+ mezzo"**: popover ancorato a `#fleet-add` con campo nome e "Aggiungi"; Invio conferma, Esc o click fuori chiude; nome vuoto = pulsante disabilitato. Tutti i testi dei nomi con `textContent`.
- [ ] **Step 6: Verificare con stub + Playwright**, in sequenza: (a) `+` su Croce A → 13 e, ricaricando la pagina, ancora 13; (b) due schede aperte: `+` in una compare nell'altra entro ~12 s; (c) `−` ripetuto fino a 0 non va sotto 0; (d) reset: primo click "Sicuro?", dopo 4 s torna normale, secondo click azzera e mostra data/ora; (e) aggiungere `<b>x</b>` mostra il testo letterale; (f) 5 mezzi: nessuno scroll a 1366×768, chiaro e scuro; (g) `/api?fail=1` mostra l'avviso e mantiene i numeri; (h) nome in modifica non viene cancellato da un refresh. Atteso: tutto come descritto, console senza errori.
- [ ] **Step 7: Commit** — `git add index.html && git commit -m "feat: sincronizzazione contatore mezzi con foglio Google"`

---

### Task 4: Installazione e documentazione

**Files:**
- Create: `docs/contatore-mezzi-setup.md`
- Modify: `README.md`, `PRODUCT.md`, `index.html` (valore di `FLEET_API`)

- [ ] **Step 1: Scrivere `docs/contatore-mezzi-setup.md`**: creare il foglio Google, Estensioni → Apps Script, incollare `Code.gs`, eseguire `inizializza` (autorizzazioni), Distribuisci → Applicazione web (esegui come "me", accesso "chiunque"), copiare l'URL `/exec`; avvertenza: dopo ogni modifica del codice serve una nuova distribuzione.
- [ ] **Step 2: Aggiornare `README.md`** (funzionalità: via "Calcolatore età", dentro "Contatore servizi mezzi") e `PRODUCT.md` (Product Purpose: stessa sostituzione).
- [ ] **Step 3: Con l'utente**: inserire l'URL `/exec` reale in `FLEET_API` e verificare da due postazioni che le variazioni compaiano su entrambe. (Questo passo richiede l'utente: crea lui il foglio.)
- [ ] **Step 4: Commit** — `git add docs README.md PRODUCT.md index.html && git commit -m "docs: installazione contatore mezzi, aggiorna README"`
