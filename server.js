import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Serve a minimal homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Socket.IO logic
io.on("connection", (socket) => {
  socket.on("cursor-update", ({ x, y }) => {
    socket.broadcast.emit("cursor-update", {
      id: socket.id,
      x,
      y
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("cursor-remove", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
