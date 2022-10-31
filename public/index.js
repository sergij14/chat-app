const socket = io();
const chatForm = document.querySelector("#chat-form");

chatForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const formData = new FormData(chatForm);
  const formDataObj = {};

  for (const [key, value] of formData) {
    formDataObj[key] = value;
  }

  socket.emit("send_message", formDataObj);
});

socket.on("message", (data) => {
  console.log(data);
});
