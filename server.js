import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/sensor", (req, res) => {
  const { eeg, temperatura, bpm, pip, alarma } = req.body;
  io.emit("nuevoDato", { eeg, temperatura, bpm, pip, alarma, fecha: new Date().toISOString() });
  console.log("Dato recibido:", req.body);
  res.json({ ok: true });
});

io.on("connection", socket => {
  console.log("Cliente conectado ✅");
  socket.on("disconnect", () => console.log("Cliente desconectado ❌"));
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT} ✅`));
