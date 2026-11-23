/**
 * Contatore servizi mezzi — backend Google Apps Script.
 * Foglio "Mezzi": colonne id, nome, n, reset (riga 1 = intestazione).
 * Setup: docs/contatore-mezzi-setup.md
 */

var NOME_MAX = 30;

/* ---------- logica pura (testata in Node: apps-script/Code.test.js) ---------- */

function pulisciNome_(nome) {
  return String(nome == null ? "" : nome).trim().slice(0, NOME_MAX).trim();
}

function applyOp(stato, op, ora) {
  var s = stato.map(function (m) {
    return { id: m.id, nome: m.nome, n: m.n, reset: m.reset };
  });
  var idx = -1;
  for (var i = 0; i < s.length; i++) if (s[i].id === op.id) idx = i;

  switch (op.op) {
    case "add": {
      var nome = pulisciNome_(op.nome);
      if (!nome) return s;
      var base = "m" + ora.getTime().toString(36), id = base, k = 1;
      var presente = function (x) { return s.some(function (m) { return m.id === x; }); };
      while (presente(id)) id = base + "-" + k++;
      s.push({ id: id, nome: nome, n: 0, reset: null });
      return s;
    }
    case "inc":
      if (idx >= 0) s[idx].n += 1;
      return s;
    case "dec":
      if (idx >= 0) s[idx].n = Math.max(0, s[idx].n - 1);
      return s;
    case "reset":
      if (idx >= 0) { s[idx].n = 0; s[idx].reset = ora.toISOString(); }
      return s;
    case "rename": {
      var nuovo = pulisciNome_(op.nome);
      if (idx >= 0 && nuovo) s[idx].nome = nuovo;
      return s;
    }
    case "remove":
      if (idx >= 0) s.splice(idx, 1);
      return s;
    default:
      return s;
  }
}

/* ---------- parte Google (non eseguita nei test) ---------- */

var FOGLIO = "Mezzi";

function foglio_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(FOGLIO);
  if (!sh) {
    sh = ss.insertSheet(FOGLIO);
    sh.getRange(1, 1, 1, 4).setValues([["id", "nome", "n", "reset"]]);
  }
  return sh;
}

function leggiStato() {
  var sh = foglio_();
  var righe = sh.getLastRow() - 1;
  if (righe < 1) return [];
  return sh.getRange(2, 1, righe, 4).getValues()
    .filter(function (r) { return r[0] !== ""; })
    .map(function (r) {
      var reset = r[3] instanceof Date ? r[3].toISOString() : (r[3] ? String(r[3]) : null);
      return { id: String(r[0]), nome: String(r[1]), n: Number(r[2]) || 0, reset: reset };
    });
}

function scriviStato(stato) {
  var sh = foglio_();
  var righe = sh.getLastRow() - 1;
  if (righe > 0) sh.getRange(2, 1, righe, 4).clearContent();
  if (stato.length) {
    sh.getRange(2, 1, stato.length, 4).setValues(
      stato.map(function (m) { return [m.id, m.nome, m.n, m.reset || ""]; })
    );
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  try { return json_({ ok: true, mezzi: leggiStato() }); }
  catch (err) { return json_({ ok: false, errore: String(err) }); }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var op = JSON.parse(e.postData.contents);
    var nuovo = applyOp(leggiStato(), op, new Date());
    scriviStato(nuovo);
    return json_({ ok: true, mezzi: nuovo });
  } catch (err) {
    return json_({ ok: false, errore: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

/** Da eseguire una volta a mano: crea il foglio con due mezzi di esempio. */
function inizializza() {
  var sh = foglio_();
  if (sh.getLastRow() < 2) {
    var s = applyOp([], { op: "add", nome: "Mezzo 1" }, new Date());
    s = applyOp(s, { op: "add", nome: "Mezzo 2" }, new Date());
    scriviStato(s);
  }
}

if (typeof module !== "undefined") module.exports = { applyOp: applyOp, NOME_MAX: NOME_MAX };
