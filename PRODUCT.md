# Product

## Register

product

## Users

Operatori della Centrale Operativa 118 USL Toscana Centro (area Firenze–Prato). Due profili condividono la stessa pagina: operatori **Trasporti Urgenti** (ex-ordinari) e operatori **Emergenza Sanitaria**. La usano durante il turno, in sala operativa, spesso su monitor diversi e anche di notte. Contesto: lavoro continuativo su turni, necessità di raggiungere in fretta lo strumento/link giusto senza distrazioni.

## Product Purpose

Portale di accesso rapido ai link e agli strumenti operativi usati in centrale (mail, rubriche, gestionali arr/soccorso, mappe, turnazioni, ecc.), più poche utilità di supporto al turno: orologio, countdown fine turno, calcolatore età paziente, ticker notizie locali. Esiste per sostituire il vecchio sito Google Sites con qualcosa di più veloce, ordinato e curato. Successo = l'operatore trova e apre il link giusto in un colpo d'occhio, e ha sotto controllo tempo e stato del turno senza cercarli.

Vincolo architetturale portante: **singolo file `index.html`** autocontenuto (HTML+CSS+JS, zero dipendenze), editabile anche da chi non è sviluppatore (i link stanno nell'oggetto `SITE_DATA`), deployato su GitHub Pages.

## Brand Personality

Console di centrale operativa: **preciso, affidabile, calmo sotto pressione**. Autorevole ma non freddo. I dati (orari, countdown, contatori, codici) hanno un trattamento da quadro strumenti; il tono testuale è essenziale e diretto, con qualche tocco umano dove non compromette la serietà (es. i messaggi del calcolatore età). Deve dare la sensazione di uno strumento vivo e sotto controllo, non di una pagina statica.

## Anti-references

- **Portale PA vecchio stile**: tabelle grigie, liste dense, estetica intranet pubblica anni 2000. Da evitare in modo esplicito.
- Di conseguenza anche: gerarchia piatta, tutto allo stesso peso, nessun senso di "stato" o di tempo.

## Design Principles

- **Il tempo è il primo cittadino.** Chi lavora in centrale vive di orario e di turno: ora corrente e countdown fine turno sono informazione di prima classe, sempre a colpo d'occhio.
- **Un click al link giusto.** La gerarchia riflette l'uso reale (Comune, Trasporti Urgenti, Emergenza, Archivio); ricerca istantanea; niente passaggi inutili tra l'operatore e lo strumento.
- **Calma sotto pressione.** Contesto di emergenza: chiarezza prima di tutto, rumore visivo ridotto al minimo, un solo elemento caratterizzante alla volta.
- **Onesto sullo stato.** L'interfaccia dice la verità operativa: badge sui link raggiungibili solo da rete interna, stato "operativo", turno in corso.
- **Zero attrito, zero dipendenze.** Single file, caricamento istantaneo, funziona identico in locale e su GitHub Pages, modificabile da un non-tecnico.

## Accessibility & Inclusion

Priorità all'**alta leggibilità operativa**: turni notturni e monitor eterogenei richiedono contrasto forte, testo di dimensione adeguata, tema chiaro e scuro con preferenza salvata. Rispetto di `prefers-reduced-motion` (ticker e micro-interazioni disattivabili). Nessun requisito WCAG formale dichiarato, ma il contrasto del testo va tenuto su livelli AA come regola pratica.
