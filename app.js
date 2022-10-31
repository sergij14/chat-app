const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);
const io = socketio(server)

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

io.on('connection', () => {
  console.log('new ws connection');
})

server.listen(port, console.log("server is running on port " + port));
