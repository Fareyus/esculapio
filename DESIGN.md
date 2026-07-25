---
name: EsculapioNET
description: Cruscotto di accesso rapido per operatori di Centrale 118 — strumento, non vetrina.
colors:
  brand: "#0e1a7a"
  brand-tint: "#2b3bb0"
  cyan: "#0a97a8"
  amber: "#a9700a"
  amber-soft: "#fbeecb"
  danger: "#c62435"
  ok: "#1fae5a"
  bg: "#e8ecf6"
  surface: "#ffffff"
  surface-2: "#f2f5fc"
  ink: "#0b1330"
  muted: "#5b6483"
  line: "#dce1ef"
  console-bg: "#eef1fb"
  urgenti: "#1a3a8a"
  emergenza: "#0a7f8f"
typography:
  display:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "1.7rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.5px"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.24rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.2px"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.88rem"
    fontWeight: 600
    lineHeight: 1.25
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.64rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.14em"
  data:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.74rem"
    fontWeight: 700
    letterSpacing: "0"
rounded:
  xs: "6px"
  sm: "9px"
  md: "12px"
  lg: "14px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "22px"
components:
  tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "12px 13px"
  key-glyph:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.brand}"
    rounded: "{rounded.sm}"
    size: "38px"
  lan-badge:
    backgroundColor: "{colors.amber-soft}"
    textColor: "{colors.amber}"
    rounded: "{rounded.xs}"
    padding: "2px 6px"
  search-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "14px 46px 14px 44px"
  age-button:
    backgroundColor: "{colors.brand}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  shift-timer:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "13px 16px"
---

# Design System: EsculapioNET

## 1. Overview

**Creative North Star: "Il Cruscotto Essenziale"**

EsculapioNET è il quadro strumenti di una sala di Centrale 118, non un sito. Chi lo guarda è a metà turno, davanti a un monitor qualunque, e deve capire in un colpo d'occhio *che ore sono, quanto manca al cambio, e dove sta il link che serve adesso*. Il sistema è quindi ridotto all'essenziale e strumentale: superfici calme, dati trattati come letture di uno strumento (monospace, tabellari), un solo elemento caratterizzante — il battito ECG dietro le notizie — e nient'altro che chieda attenzione.

L'identità nasce dal soggetto: il blu del logo Esculapio (`#0e1a7a`) come colore portante, un teal clinico (`#0a97a8`) come unico accento, un ambra (`#a9700a`) riservato allo stato "solo rete interna". Tipografia di sistema (zero font esterne: il caricamento istantaneo è un requisito operativo), con il contrasto affidato al monospace tabellare dei dati contro le micro-etichette maiuscole. La densità è media: abbastanza informazione da evitare il ping-pong tra le schermate, abbastanza aria da non sembrare una tabella.

Questo sistema **rifiuta esplicitamente l'estetica da portale PA vecchio stile**: niente tabelle grigie, niente liste dense tutte allo stesso peso, niente look da intranet pubblica anni 2000. Rifiuta anche il template SaaS generico (hero-metric, griglie di card identiche con gradiente).

**Key Characteristics:**
- Dati come strumenti: orologio, countdown e contatori in monospace tabellare.
- Un solo accento (teal clinico) sopra un blu-brand strutturale.
- Chiaro e scuro paritari, non un default estetico ma una necessità (turni notturni).
- Una firma sola: la linea ECG dietro il ticker notizie.
- Superfici calme, gerarchia per uso reale (Comune / Urgenti / Emergenza / Archivio).

## 2. Colors

Palette fredda e istituzionale: un blu-brand profondo che struttura, un teal clinico come unica voce d'accento, un ambra di servizio per lo stato di rete. Nessun colore è decorativo; ognuno segnala qualcosa.

### Primary
- **Blu Esculapio** (`#0e1a7a`): il blu del logo. Colore portante — marchio, "NET" del wordmark, glyph delle tile, linea ECG in tema chiaro, sfondo del bottone Calcola. In tema scuro diventa un periwinkle più chiaro (`#7d92f5`) per reggere sul fondo notte.

### Secondary
- **Teal Clinico** (`#0a97a8`): unico accento. Focus dei campi, hover delle tile (canale + bordo), etichetta del ticker, linea ECG in tema scuro (`#2ec7d6`). È l'accento che "accende" l'interazione.

### Tertiary
- **Ambra di Rete** (`#a9700a` su fondo `#fbeecb`): esclusivamente il badge `lan` sui link raggiungibili solo dalla rete interna 118. Non è decorazione: è un avviso operativo. In scuro: `#f2b446`.
- **Urgenti / Emergenza** (`#1a3a8a` / `#0a7f8f`): tinte di intestazione per distinguere le due colonne operative. In scuro: `#7b9ce8` / `#2bc7d6`.

### Neutral
- **Inchiostro** (`#0b1330`): testo primario. In scuro: `#e9edfb`.
- **Muto** (`#5b6483`): etichette, didascalie, testo secondario. In scuro: `#8a93bd`.
- **Fondo** (`#e8ecf6`): sfondo pagina, azzurrino freddo. In scuro: `#060a1a`.
- **Superficie** (`#ffffff` / secondaria `#f2f5fc`): tile, barre, campi. In scuro: `#0d1330` / `#131a3c`.
- **Linea** (`#dce1ef`): bordi e divisori. In scuro: `#222a54`.
- **Fascia Console** (`#eef1fb`): sfondo dell'header e della barra news, appena distinto dal fondo pagina. In scuro: `#04081a`.

### Named Rules
**La Regola dell'Unica Voce.** Il teal clinico è l'unico accento. Compare sull'interazione (focus, hover) e sulla firma ECG, mai come riempimento. Se una schermata ha teal ovunque, è sbagliata.

**La Regola dell'Ambra Onesta.** L'ambra significa una cosa sola: "questo link funziona solo da rete interna". Non usarlo mai come colore estetico.

## 3. Typography

**Display / Dati:** ui-monospace (SFMono-Regular, Menlo, Consolas)
**Testo / UI:** stack di sistema (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
**Label/Mono Font:** stesso monospace di sistema per contatori e badge

**Character:** una sola famiglia sans di sistema per tutto il testo, contrapposta al monospace tabellare per ogni numero che conta. Il contrasto è sull'asse sans-vs-mono, non su due sans simili. Nessuna font esterna: il caricamento istantaneo è parte del design.

### Hierarchy
- **Display** (mono, 700, 1.7rem, lh 1): l'orologio nell'header. La lettura più grande della pagina — è un quadro strumenti.
- **Headline** (sans, 800, 1.24rem): il wordmark "EsculapioNET". Unico uso.
- **Title** (mono, 700, ~0.64rem, uppercase, tracking 0.14em): i tag di sezione (COMUNE, TRASPORTI URGENTI…) e le etichette del cruscotto.
- **Body** (sans, 600, 0.88rem, lh 1.25): nomi dei link nelle tile e testo generale.
- **Label** (sans, 800, 0.64rem, uppercase, tracking 0.14em): micro-etichette (stato, didascalie turno).
- **Data** (mono, 700, tabular-nums): countdown, contatori `·N`, badge `lan`, risultato età.

### Named Rules
**La Regola del Numero-Strumento.** Ogni valore numerico che cambia nel tempo o che si conta — orari, countdown, contatori, età — è in monospace tabellare (`font-variant-numeric: tabular-nums`). I numeri non ballano.

## 4. Elevation

Sistema **stratificato con ombra morbida**: le superfici-contenitore (barre, campi, timer, archivio, ticker) portano un'ombra ambientale tenue che le stacca dal fondo, così l'occhio legge subito i livelli. Le tile-link, invece, sono piatte a riposo e si sollevano solo all'interazione: l'ombra diventa lì un feedback, non una decorazione permanente.

### Shadow Vocabulary
- **Ombra Ambientale** (`box-shadow: 0 1px 2px rgba(11,19,48,.05), 0 10px 30px rgba(11,19,48,.10)`): contenitori a riposo (search, ticker, timer, archivio, barra età). In scuro: `0 1px 0 rgba(255,255,255,.02), 0 14px 34px rgba(0,0,0,.5)`.
- **Sollevamento all'hover** (stessa ombra + `translateY(-2px)`): solo sulle tile-link, come risposta al puntatore.

### Named Rules
**La Regola del Contenitore vs. Azione.** I contenitori hanno ombra a riposo per stratificare; gli elementi azionabili (tile) sono piatti finché non li tocchi. L'ombra sulle tile è stato, non arredo.

## 5. Components

### Tile-link (componente firma)
Il mattone del sistema. Riga con **glyph monospace** (iniziali del nome in un quadratino `surface-2`), nome del link e — se serve — badge `lan`.
- **Corner Style:** 14px (`{rounded.lg}`).
- **Background:** `surface` su bordo `line`.
- **Hover:** `translateY(-2px)`, bordo verso teal, ombra ambientale, e un **canale interno sinistro** che si accende in gradiente teal→brand (pseudo-elemento `::before`, non un bordo).
- **Focus:** outline teal 2px, offset 2px.
- **Padding:** 12px 13px; griglia `repeat(auto-fill, minmax(212px, 1fr))` (172px nelle colonne strette).

### Chips / Badge
- **`lan`:** monospace .58rem maiuscolo, testo ambra su `amber-soft`, bordo ambra trasparente, radius 5px. Solo per link a rete interna.
- **Tag di sezione:** monospace maiuscolo su `surface-2`, radius 7px.

### Cards / Containers
- **Corner Style:** 12–14px.
- **Background:** `surface`.
- **Shadow Strategy:** Ombra Ambientale a riposo (vedi Elevation).
- **Border:** 1px `line`.
- **Internal Padding:** 12–16px.

### Inputs / Fields
- **Ricerca:** `surface`, bordo `line`, radius 12px, icona lente a sinistra, `<kbd>\</kbd>` a destra come scorciatoia. In fondo alla pagina.
- **Focus:** bordo teal + alone `0 0 0 3px` teal al 22%.
- **Anno di nascita:** campo numerico compatto senza spinner; focus teal.

### Buttons
- **Shape:** 9px (`{rounded.sm}`).
- **Primary (Calcola):** fondo `brand`, testo bianco (in scuro testo scuro `#08122e`), padding 8px 16px.
- **Hover:** opacità .88 + `translateY(-1px)`.
- **Theme toggle:** icona quadrata `console-panel`, bordo `console-line`.

### Header di Console + ECG (signature)
Fascia superiore con logo, wordmark `⚕ EsculapioNET`, stato `● Operativo` (dot pulsante), orologio monospace e toggle tema; sotto, la **barra news** con l'**elettrocardiogramma come sfondo in secondo piano** (opacità .10 chiaro / .18 scuro), tinta `ecg` = brand in chiaro, teal in scuro. È l'unica firma del sistema.

## 6. Do's and Don'ts

### Do:
- **Do** trattare ogni numero che conta (orari, countdown, contatori, età) in **monospace tabellare**.
- **Do** tenere il **teal clinico come unico accento**, riservato a focus, hover ed ECG.
- **Do** usare l'**ambra solo** per il badge `lan` (link di sola rete interna): è un avviso, non un colore.
- **Do** mantenere **chiaro e scuro paritari**, con contrasto del testo su livelli AA (turni notturni, monitor eterogenei).
- **Do** far **sollevare** le tile all'hover; tenere i contenitori con ombra ambientale a riposo.
- **Do** rispettare `prefers-reduced-motion`: ticker e micro-interazioni si spengono.

### Don't:
- **Don't** ricadere nel **portale PA vecchio stile**: niente tabelle grigie, liste dense, tutto allo stesso peso.
- **Don't** usare il **template SaaS**: hero-metric (numerone + label + gradiente), griglie di card identiche a ripetizione.
- **Don't** usare **bordi-accento laterali >1px** (side-stripe) su tile, callout o barre: sostituire con bordo pieno, tinta di sfondo, pallino guida o canale interno all'hover.
- **Don't** introdurre **font esterne**: il caricamento istantaneo è un requisito, non una preferenza.
- **Don't** spargere il **teal** come riempimento; se è ovunque, non è più un accento.
- **Don't** aggiungere **gradient text** o **glassmorphism** decorativi.
