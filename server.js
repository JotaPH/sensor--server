const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

let dato = { valor: 0, fecha: new Date().toISOString() };

app.post("/data", (req, res) => {
  dato = { valor: req.body.valor, fecha: new Date().toISOString() };
  io.emit("nuevoDato", dato);
  console.log("Dato recibido:", dato);
  res.json({ ok: true });
});

app.get("/data", (req, res) => res.json(dato));

server.listen(10000, () => console.log("Servidor en puerto 10000"));
