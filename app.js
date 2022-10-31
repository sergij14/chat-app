const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const io = require("socket.io");
dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, "public")));

io.on('connection', () => {
  console.log('new sw connection');
})

server.listen(port, console.log("server is running on port " + port));
