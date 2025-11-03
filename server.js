import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json()); // para procesar JSON del body

// --- Configuración para rutas de archivos estáticos ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

// --- Endpoint principal ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// --- Endpoint para recibir datos del sensor ---
app.post("/api/sensor", (req, res) => {
  const { valor, fecha } = req.body;
  console.log("Dato recibido:", req.body);
  io.emit("nuevo_dato", { valor, fecha }); // enviar al gráfico en tiempo real
  res.json({ ok: true });
});

// --- WebSocket: comunicación en tiempo real ---
io.on("connection", (socket) => {
  console.log("Cliente conectado ✅");
  socket.on("disconnect", () => console.log("Cliente desconectado ❌"));
});

// --- Iniciar servidor ---
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT} ✅`));
