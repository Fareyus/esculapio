const test = require("node:test");
const assert = require("node:assert/strict");
const { applyOp, NOME_MAX } = require("./Code.gs");

const ORA = new Date("2026-11-23T10:00:00Z");
const base = () => [
  { id: "a", nome: "Croce A", n: 3, reset: null },
  { id: "b", nome: "Misericordia", n: 0, reset: null },
];

test("add: aggiunge un mezzo con nome pulito, n=0, reset=null e id", () => {
  const s = applyOp([], { op: "add", nome: "  Croce A " }, ORA);
  assert.equal(s.length, 1);
  assert.equal(s[0].nome, "Croce A");
  assert.equal(s[0].n, 0);
  assert.equal(s[0].reset, null);
  assert.ok(s[0].id);
});

test("add: due aggiunte nello stesso istante hanno id diversi", () => {
  let s = applyOp([], { op: "add", nome: "X" }, ORA);
  s = applyOp(s, { op: "add", nome: "Y" }, ORA);
  assert.notEqual(s[0].id, s[1].id);
});

test("add: nome vuoto o di soli spazi non aggiunge nulla", () => {
  assert.deepEqual(applyOp([], { op: "add", nome: "" }, ORA), []);
  assert.deepEqual(applyOp([], { op: "add", nome: "   " }, ORA), []);
});

test("add: nome oltre il massimo viene troncato", () => {
  const s = applyOp([], { op: "add", nome: "x".repeat(40) }, ORA);
  assert.equal(NOME_MAX, 30);
  assert.equal(s[0].nome.length, 30);
});

test("inc: due incrementi in sequenza si sommano", () => {
  let s = applyOp(base(), { op: "inc", id: "a" }, ORA);
  s = applyOp(s, { op: "inc", id: "a" }, ORA);
  assert.equal(s[0].n, 5);
});

test("dec: scende di uno ma mai sotto zero", () => {
  assert.equal(applyOp(base(), { op: "dec", id: "a" }, ORA)[0].n, 2);
  assert.equal(applyOp(base(), { op: "dec", id: "b" }, ORA)[1].n, 0);
});

test("reset: azzera e registra data/ora ISO", () => {
  const s = applyOp(base(), { op: "reset", id: "a" }, ORA);
  assert.equal(s[0].n, 0);
  assert.equal(s[0].reset, "2026-11-23T10:00:00.000Z");
});

test("rename: cambia il nome, ignora nomi vuoti", () => {
  assert.equal(applyOp(base(), { op: "rename", id: "a", nome: " Nuova " }, ORA)[0].nome, "Nuova");
  assert.equal(applyOp(base(), { op: "rename", id: "a", nome: "  " }, ORA)[0].nome, "Croce A");
});

test("remove: toglie la riga", () => {
  const s = applyOp(base(), { op: "remove", id: "a" }, ORA);
  assert.deepEqual(s.map((m) => m.id), ["b"]);
});

test("id inesistente: nessun errore, stato invariato", () => {
  for (const op of ["inc", "dec", "reset", "remove", "rename"]) {
    assert.deepEqual(applyOp(base(), { op, id: "zzz", nome: "N" }, ORA), base());
  }
});

test("operazione sconosciuta: stato invariato", () => {
  assert.deepEqual(applyOp(base(), { op: "boh", id: "a" }, ORA), base());
});

test("non muta l'array in ingresso", () => {
  const s = base();
  applyOp(s, { op: "inc", id: "a" }, ORA);
  applyOp(s, { op: "remove", id: "a" }, ORA);
  assert.deepEqual(s, base());
});
