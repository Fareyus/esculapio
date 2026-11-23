// Mini client CDP per verificare la pagina con Chrome headless (nessuna dipendenza).
// Uso: const {open}=require("./cdp"); const p=await open("http://localhost:8099",1366,768);
//      await p.eval("document.title"); await p.shot("/out/a.png"); await p.close();
const fs = require("node:fs");
const HOST = process.env.CDP || "http://127.0.0.1:9222";

async function open(url, w = 1366, h = 768, scheme = "light") {
  const tab = await (await fetch(`${HOST}/json/new?about:blank`, { method: "PUT" })).json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pend = new Map(); const logs = [];
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pend.has(d.id)) { const [ok, ko] = pend.get(d.id); pend.delete(d.id); d.error ? ko(new Error(d.error.message)) : ok(d.result); }
    else if (d.method === "Runtime.exceptionThrown") logs.push("EXC " + d.params.exceptionDetails.text + " " + (d.params.exceptionDetails.exception?.description || ""));
    else if (d.method === "Runtime.consoleAPICalled" && d.params.type === "error") logs.push("console.error " + d.params.args.map((a) => a.value || a.description).join(" "));
  };
  const send = (method, params = {}) => new Promise((ok, ko) => { const i = ++id; pend.set(i, [ok, ko]); ws.send(JSON.stringify({ id: i, method, params })); });
  await send("Runtime.enable"); await send("Page.enable");
  const vp = (w2, h2) => send("Emulation.setDeviceMetricsOverride", { width: w2, height: h2, deviceScaleFactor: 1, mobile: false });
  await vp(w, h);
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: scheme }] });
  await send("Page.navigate", { url });
  await new Promise((r) => setTimeout(r, 1500));
  const page = {
    logs,
    send,
    viewport: vp,
    async eval(expr) {
      const r = await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
      return r.result.value;
    },
    async click(sel) { return page.eval(`document.querySelector(${JSON.stringify(sel)}).click()`); },
    async wait(ms) { return new Promise((r) => setTimeout(r, ms)); },
    async shot(file) { const r = await send("Page.captureScreenshot", { format: "png" }); fs.writeFileSync(file, Buffer.from(r.data, "base64")); },
    async close() { ws.close(); await fetch(`${HOST}/json/close/${tab.id}`); },
  };
  return page;
}
module.exports = { open };
