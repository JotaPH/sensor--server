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
  const data = req.body;

  // Si llega un arreglo (lote), emitir cada dato individual
  if (Array.isArray(data)) {
    data.forEach(d => {
      io.emit("nuevoDato", {
        ...d,
        fecha: new Date().toISOString()
      });
    });
    console.log(`📦 Lote recibido con ${data.length} datos`);
  } else {
    io.emit("nuevoDato", {
      ...data,
      fecha: new Date().toISOString()
    });
    console.log("Dato recibido:", data);
  }

  res.json({ ok: true });
});

io.on("connection", socket => {
  console.log("Cliente conectado ✅");
  socket.on("disconnect", () => console.log("Cliente desconectado ❌"));
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT} ✅`));
