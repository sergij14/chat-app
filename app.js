const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const generateMessage = require("./utils/generateMessage");
dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("join", ({ room, username }) => {
    socket.join(room);

    socket.emit("message", generateMessage("Welcome"));
    socket.broadcast
      .to(room)
      .emit(
        "message",
        generateMessage(`${username} has joined to ${room} room`)
      );
  });

  socket.on("send_message", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed");
    }

    io.emit("message", generateMessage(message));
    callback();
  });

  socket.on("send_location", ({ longitude, latitude }, callback) => {
    io.emit(
      "location_message",
      generateMessage(`http://google.com/maps/?q=${latitude},${longitude}`)
    );
    callback();
  });

  socket.on("disconnect", () => {
    socket.emit("message", generateMessage("A user has disconnected"));
  });
});

server.listen(port, console.log("server is running on port " + port));
