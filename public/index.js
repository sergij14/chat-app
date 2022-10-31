const socket = io();
const chatForm = document.querySelector("#chat-form");
const sendLocationBtn = document.querySelector("#send-location-btn");

chatForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const formData = new FormData(chatForm);
  const formDataObj = {};

  for (const [key, value] of formData) {
    formDataObj[key] = value;
  }

  socket.emit("send_message", formDataObj, (err) => {
    if (err) {
      return console.log(err);
    }

    console.log("message delivered");
  });
});

socket.on("message", (data) => {
  console.log(data);
});

sendLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Your browser does not support geolocation");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    const {
      coords: { latitude, longitude },
    } = position;

    socket.emit("send_location", {
      latitude,
      longitude,
    }, () => {
      console.log('location shared')
    });
  });
});
