const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const generateMessage = require("./utils/generateMessage");
const {
  addUser,
  removeUser,
  getUser,
  getRoomUsers,
} = require("./utils/trackUsers");
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

    socket.emit("message", generateMessage("Admin", "Welcome"));
    socket
      .to(user.room)
      .emit(
        "message",
        generateMessage(
          "Admin",
          `${user.username} has joined to ${user.room} room`
        )
      );

    io.to(user.room).emit("room_update", {
      room: user.room,
      users: getRoomUsers(user.room),
    });

    callback();
  });

  socket.on("send_message", (message, callback) => {
    const user = getUser(socket.id);
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed");
    }

    if (!user) {
      return callback("Please refresh the page");
    }

    io.to(user.room).emit("message", generateMessage(user.username, message));
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("Admin", `${user.username} has disconnected`)
      );
      io.to(user.room).emit("room_update", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

server.listen(port, console.log("server is running on port " + port));
