# Contatore servizi mezzi — installazione

## Stato attuale

In uso sulle postazioni dal **23/11/2026**.

- **Foglio Google dei dati:** [Contatore mezzi](https://docs.google.com/spreadsheets/d/16t4INNe1ZIKcmWGA-6kTOHFMRtllsQHwkkXR1OIqRhQ/edit?usp=sharing) — scheda *Mezzi* (colonne `id`, `nome`, `n`, `reset`).
- Lo script (Estensioni → Apps Script, dentro il foglio) è la copia di `apps-script/Code.gs` pubblicata come applicazione web.
  L'URL `/exec` è nel codice di `index.html` (costante `FLEET_API`).
- **Correggere un numero o un nome a mano:** apri il foglio e cambia `n` o `nome`; la pagina si aggiorna entro ~12 s. Non cambiare `id`.
- **Rimettere a posto tutto:** cancellando le righe dalla 2 in giù e rieseguendo `inizializza` dall'editor dello script si ricreano "Mezzo 1" e "Mezzo 2".
- Il link del foglio è pubblico nel repo per scelta: se qualcuno lo modifica per scherzo, si corregge dal foglio
  (Cronologia delle versioni: File → Cronologia delle versioni) e non ci sono dati sensibili.

---

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

### Controllo dalla postazione (importante)

Da **una postazione della centrale** apri nel browser l'URL `/exec` appena copiato. Deve mostrare un testo che inizia con
`{"ok":true,"mezzi":[…` . Se si carica, il firewall lascia passare tutto il percorso: la richiesta passa da `script.google.com`
e viene girata a `script.googleusercontent.com`, quindi **non basta** poter aprire `script.google.com`.
Se la pagina non si apre o chiede di accedere a Google, il contatore resterà su "non raggiungibile": serve far
sbloccare `*.googleusercontent.com` (o rivedere la distribuzione: "Chiunque", non "Chiunque con account Google").

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
