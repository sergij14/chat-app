const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

let count = 0;

io.on("connection", (socket) => {
  io.emit("count_update", count);
  socket.on("increment", () => {
    count++;
    io.emit("count_update", count);
  });
});

server.listen(port, console.log("server is running on port " + port));
