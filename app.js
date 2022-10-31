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

io.on("connection", (socket) => {
  socket.emit("message", { data: "welcome" });

  socket.on("send_message", (data) => {
    console.log(data);

    io.emit("message", { data });
  });
});

server.listen(port, console.log("server is running on port " + port));
