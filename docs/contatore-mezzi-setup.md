# Contatore servizi mezzi — installazione

I numeri vivono in un foglio Google; uno script (Apps Script) fa da ponte tra il foglio e la pagina.
Si fa una volta sola. Non serve altro: niente server, niente database.

## 1. Foglio e script

1. Crea un nuovo foglio Google (nome a piacere, es. "Contatore mezzi").
2. **Estensioni → Apps Script**.
3. Cancella il codice di esempio e incolla tutto il contenuto di `apps-script/Code.gs`. Salva.
4. Dal menu delle funzioni scegli **`inizializza`** e premi **Esegui**. Autorizza l'accesso al foglio
   quando richiesto (avviso "app non verificata": Avanzate → Vai a… è normale, lo script è tuo).
   Nel foglio compare la scheda **Mezzi** con "Mezzo 1" e "Mezzo 2".
5. **Distribuisci → Nuova distribuzione → Applicazione web**:
   - Esegui come: **Me**
   - Chi ha accesso: **Chiunque**
6. Copia l'URL che finisce con `/exec`.

## 2. Collegare la pagina

In `index.html` cerca la riga `const FLEET_API = "";` e incolla l'URL tra le virgolette. Poi:

```bash
git add index.html && git commit -m "contatore mezzi: collega il foglio" && git push
```

Dopo ~30-60 s il riquadro "Servizi mezzi" mostra i numeri del foglio.

## Note d'uso

- **Modifiche allo script:** dopo ogni modifica serve **Distribuisci → Gestisci distribuzioni → Modifica → Nuova versione**,
  altrimenti la pagina continua a usare il codice vecchio. L'URL `/exec` resta lo stesso.
- **Correggere un numero a mano:** si può editare la colonna `n` della scheda *Mezzi*; la pagina lo mostra al ricontrollo successivo (≤ 12 s).
  Non cambiare la colonna `id`.
- **Sicurezza:** chi conosce l'URL `/exec` può leggere e scrivere i contatori. La pagina è `noindex` e l'URL non va condiviso fuori dal giro.
  Nel foglio non ci sono dati sensibili. Se l'URL trapela, crea una nuova distribuzione e aggiorna `FLEET_API`.
- **Se Google non risponde:** il riquadro mostra "Contatore non raggiungibile — numeri non aggiornati" e riprova da solo.
- **Più operatori insieme:** i click si sommano (lo script riceve "+1"/"−1", non il numero finale).

## Test (per chi modifica il codice)

Servono Node ≥ 22 e Chrome headless; sul server di casa si usa Docker.

```bash
node --test apps-script/Code.test.js          # logica delle operazioni
node test/fleet-stub.js                        # simula il foglio su http://localhost:8099
google-chrome --headless=new --remote-debugging-port=9222 about:blank &
node test/fleet-ui-check.js /percorso/screenshot   # 28 controlli sul riquadro (≈40 s)
```
