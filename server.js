import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json()); // para procesar JSON del body

// --- Configuración para rutas de archivos estáticos ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

// --- Variables para almacenar último dato ---
let ultimoDato = { valor: 0, fecha: new Date().toISOString() };

// --- Endpoint principal ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// --- Endpoint para recibir datos del sensor ---
app.post("/api/sensor", (req, res) => {
  const { valor } = req.body;
  ultimoDato = { valor, fecha: new Date().toISOString() };
  console.log("Dato recibido:", ultimoDato);

  // enviar al cliente conectado en tiempo real
  io.emit("nuevoDato", ultimoDato);

  res.json({ ok: true });
});

// --- Endpoint para obtener último dato vía navegador ---
app.get("/data", (req, res) => {
  res.json(ultimoDato);
});

// --- WebSocket: comunicación en tiempo real ---
io.on("connection", (socket) => {
  console.log("Cliente conectado ✅");
  socket.on("disconnect", () => console.log("Cliente desconectado ❌"));
});

// --- Iniciar servidor ---
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT} ✅`));
