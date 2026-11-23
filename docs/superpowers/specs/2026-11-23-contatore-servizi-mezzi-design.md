# Contatore servizi mezzi — design breve

Data: 2026-11-23 · Stato: approvato dall'utente il 2026-11-23

## Intento
Mezzi di associazioni diverse partono da sedi vicine. La centrale vuole
distribuire i servizi in modo circa uguale tra le associazioni, quindi serve
vedere quanti servizi ha fatto ciascun mezzo. Il contatore deve essere
condiviso tra 3-4 postazioni, che devono vedere gli stessi numeri.

## Obiettivi
- Riquadro nella pagina con una riga per mezzo: nome modificabile, contatore,
  pulsanti − e +, reset con data/ora dell'ultimo reset.
- Pulsante "+ mezzo" con menu a comparsa per aggiungere un mezzo (2 iniziali,
  fino a 4-5).
- Possibilità di togliere un mezzo.
- Numeri identici su tutte le postazioni, riallineati ogni 10-15 s.

- Rimuovere dalla pagina il calcolatore dell'età del paziente (obsoleto con il
  nuovo programma). I countdown turni stanno già nell'header e non cambiano;
  il contatore mezzi prende il posto del blocco "Età paziente" sopra la ricerca.

## Non-obiettivi
- Nessuno storico dei singoli click né registro delle azioni.
- Nessun login o permessi per utente.
- Nessun aggiornamento istantaneo (il ricontrollo periodico basta).

## Anti-obiettivi
- La pagina non deve richiedere scroll: il riquadro resta compatto anche con 5 mezzi.
- Un errore o un'assenza di Google non deve rompere il resto del portale.
- Click simultanei da postazioni diverse non devono sovrascriversi.

## Vincoli
- Il sito resta un singolo `index.html` statico su GitHub Pages, senza database.
- Il firewall aziendale blocca `fareyus.github.io`; `script.google.com` è
  raggiungibile (verificato dall'utente dalla postazione).
- Design esistente: teal unico accento, numeri in monospace tabellare,
  niente side-stripe border (vedi `DESIGN.md`).

## Approcci considerati
- **A. Foglio Google + Apps Script (scelto dall'utente).** Archivio condiviso
  nel foglio, script come ponte. Zero costi e zero manutenzione, foglio
  correggibile a mano. Limite: chi conosce il link dello script potrebbe
  scrivere (rischio accettato: pagina interna `noindex`).
- B. Firebase: aggiornamenti più rapidi ma più configurazione e chiavi nel codice. Scartato.
- C. Solo `localStorage`: ogni postazione avrebbe il suo conteggio. Scartato.

## Design decisi con l'utente
- Una riga per mezzo; nome modificabile con click, salvato da solo.
- − e + agiscono subito; il numero non scende sotto zero.
- **Conferma solo su reset e rimozione** (secondo click entro pochi secondi).
- Il reset azzera il contatore del mezzo e registra data/ora, mostrata in piccolo.
- "+ mezzo" apre un menu a comparsa col campo nome; i mezzi arrivano dal
  foglio, non da un elenco nel codice.
- Il tasto per togliere un mezzo sta nel suo menu, con la stessa conferma del reset.
- Lo script riceve la **variazione** (+1, −1, reset, aggiungi, rimuovi), non
  il valore finale, e usa un blocco (`LockService`) per serializzare le scritture.
- Se Google non risponde: avviso discreto nel riquadro, resto della pagina intatto.

## Scelte mie (da verificare)
- Riquadro nella fascia della barra età/countdown o subito sotto.
- Ricontrollo ogni 10-15 s, in pausa a scheda nascosta.
- Foglio con una riga per mezzo: id, nome, contatore, ultimo reset.
- Il codice dello script Apps Script va nel repo (`docs/` o cartella dedicata)
  perché l'utente lo incolli nel foglio e lo pubblichi una volta.

## Lasciato al realizzatore
- Dettagli grafici dentro i token esistenti; formato esatto delle date.
- Formato della risposta JSON dello script e gestione errori di rete.
- Nome del foglio e istruzioni di pubblicazione dello script.
