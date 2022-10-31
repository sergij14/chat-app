const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.emit("message", "welcome");
  socket.broadcast.emit("message", "A new user has joined the chat");

  socket.on("send_message", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed");
    }

    io.emit("message", message);
    callback();
  });

  socket.on("send_location", ({ longitude, latitude }, callback) => {
    io.emit("location_message", `http://google.com/maps/?q=${latitude},${longitude}`);
    callback();
  });

  socket.on("disconnect", () => {
    socket.emit("message", "A user has disconnected");
  });
});

server.listen(port, console.log("server is running on port " + port));
