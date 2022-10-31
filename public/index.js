const socket = io();

const btn = document.querySelector("#btn");

btn.addEventListener("click", () => {
  socket.emit("increment");
});

socket.on("count_update", (data) => {
  console.log('count was updated to ', data);
});
