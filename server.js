import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

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

server.listen(3000, () => {
  console.log("Cursor server running on port 3000");
});

