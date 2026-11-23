// Server di prova locale: serve index.html con FLEET_API puntato a sé stesso e
// simula il backend Apps Script usando la stessa applyOp (stato in memoria).
//   node test/fleet-stub.js        → http://localhost:8099
//   /api         GET/POST come lo script Google
//   /api?fail=1  risponde HTML (simula pagina di login / errore); /__fail?on=1 lo fa per tutte le chiamate
//   /__reset     ripristina i due mezzi iniziali
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { applyOp } = require("../apps-script/Code.gs");

const PORT = process.env.PORT || 8099;
const ROOT = path.join(__dirname, "..");
const iniziale = () => [
  { id: "a", nome: "Croce A", n: 12, reset: "2026-11-03T13:20:00.000Z" },
  { id: "b", nome: "Misericordia", n: 9, reset: null },
];
let stato = iniziale();
let getDelay = 0; // /__delay?ms=N ritarda solo le risposte GET (lo stato è letto subito, come una lettura lenta)
let fail = false; // /__fail?on=1 simula Google non raggiungibile; /__reset ripristina lo stato

function pagina() {
  return fs
    .readFileSync(path.join(ROOT, "index.html"), "utf8")
    .replace(/const FLEET_API = "[^"]*";/, `const FLEET_API = "http://localhost:${PORT}/api";`);
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" };
    if (url.pathname === "/__reset") { stato = iniziale(); fail = false; res.writeHead(200); return res.end("ok"); }
    if (url.pathname === "/__delay") { getDelay = +url.searchParams.get("ms") || 0; res.writeHead(200); return res.end("ok"); }
    if (url.pathname === "/__fail") { fail = url.searchParams.get("on") === "1"; res.writeHead(200); return res.end("ok"); }
    if (url.pathname === "/api") {
      if (fail || url.searchParams.get("fail")) {
        res.writeHead(200, { ...cors, "Content-Type": "text/html" });
        return res.end("<html>Accedi a Google</html>");
      }
      if (req.method === "OPTIONS") { res.writeHead(204, cors); return res.end(); }
      const rispondi = (ritardo = 0) => {
        const corpo = JSON.stringify({ ok: true, mezzi: stato }); // snapshot al momento della lettura
        setTimeout(() => { res.writeHead(200, { ...cors, "Content-Type": "application/json" }); res.end(corpo); }, ritardo);
      };
      if (req.method === "POST") {
        let body = "";
        req.on("data", (c) => (body += c));
        req.on("end", () => {
          try { stato = applyOp(stato, JSON.parse(body), new Date()); } catch (e) {}
          rispondi();
        });
        return;
      }
      return rispondi(getDelay);
    }
    if (url.pathname === "/" || url.pathname === "/index.html") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(pagina());
    }
    const file = path.join(ROOT, path.normalize(url.pathname).replace(/^(\.\.[/\\])+/, ""));
    if (file.startsWith(ROOT) && fs.existsSync(file) && fs.statSync(file).isFile()) {
      res.writeHead(200);
      return res.end(fs.readFileSync(file));
    }
    res.writeHead(404); res.end("404");
  })
  .listen(PORT, () => console.log("stub su http://localhost:" + PORT));
