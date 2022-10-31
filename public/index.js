const socket = io();

// elements
const chatForm = document.querySelector("#chat-form");
const sendLocationBtn = document.querySelector("#send-location-btn");
const chatFormBtn = document.querySelector("button");
const chatFormMessage = chatForm.querySelector("input");
const chatMessages = document.querySelector("#chat-messages");

//templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML;

socket.on("message", (message) => {
  const html = Mustache.render(messageTemplate, {message});
  chatMessages.insertAdjacentHTML("beforeend", html);
});

socket.on("location_message", (url) => {
  const html = Mustache.render(locationMessageTemplate, {url});
  chatMessages.insertAdjacentHTML("beforeend", html);
});

chatForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const message = evt.target.elements.message.value;
  chatFormBtn.setAttribute("disabled", "disabled");

  socket.emit("send_message", message, (err) => {
    if (err) {
      return console.log(err);
    }

    chatFormBtn.removeAttribute("disabled");
    chatFormMessage.value = "";
    chatFormMessage.focus();
    console.log("message delivered");
  });
});

sendLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Your browser does not support geolocation");
  }
  sendLocationBtn.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((position) => {
    const {
      coords: { latitude, longitude },
    } = position;

    socket.emit(
      "send_location",
      {
        latitude,
        longitude,
      },
      () => {
        console.log("location shared");
        sendLocationBtn.removeAttribute("disabled");
      }
    );
  });
});
