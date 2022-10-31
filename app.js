const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const generateMessage = require("./utils/generateMessage");
const { addUser, removeUser } = require("./utils/trackUsers");
dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("join", (options, callback) => {
    const { user, error } = addUser({ id: socket.id, ...options });

    if (error) {
      return callback(error);
    }
    socket.join(user.room);

    socket.emit("message", generateMessage("Welcome"));
    socket
      .to(user.room)
      .emit(
        "message",
        generateMessage(`${user.username} has joined to ${user.room} room`)
      );
    callback();
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
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} has disconnected`)
      );
    }
  });
});

server.listen(port, console.log("server is running on port " + port));
