const socket = io();

// elements
const chatForm = document.querySelector("#chat-form");
const sendLocationBtn = document.querySelector("#send-location-btn");
const chatFormBtn = document.querySelector("button");
const chatFormMessage = chatForm.querySelector("textarea");
const chatMessages = document.querySelector("#chat-messages");
const notifications = document.querySelector("#notifications");

// consttants
const DATE_FORMAT = "DD/MM/YYYY - hh:mm:ss";
const NOTIFICATION = {
  SUCCESS: "success",
  WARNING: "warning",
  DANGER: "danger",
};

// templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;
const notificationTemplate = document.querySelector(
  "#notification-template"
).innerHTML;

// utils
const renderNotification = (message, type) => {
  const html = Mustache.render(notificationTemplate, {
    message,
    type,
  });
  notifications.innerHTML = "";
  notifications.insertAdjacentHTML("beforeend", html);
  setTimeout(() => {
    notifications.innerHTML = "";
  }, 2000);
};

// query params
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

/////////////////////////////////////////////////////////////////////

socket.on("message", ({ text, createdAt, username }) => {
  const html = Mustache.render(messageTemplate, {
    message: text,
    createdAt: moment(createdAt).format(DATE_FORMAT),
    username
  });
  chatMessages.insertAdjacentHTML("beforeend", html);
});

socket.on("location_message", ({ text, createdAt }) => {
  const html = Mustache.render(locationMessageTemplate, {
    url: text,
    createdAt: moment(createdAt).format(DATE_FORMAT),
    username
  });
  chatMessages.insertAdjacentHTML("beforeend", html);
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    chatForm.classList.add("is-hidden");
    setTimeout(() => {
      location.href = "/index.html";
    }, 1000);
    return renderNotification(error, NOTIFICATION.DANGER);
  }
});

chatForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const message = evt.target.elements.message.value;
  if (message === "") {
    return renderNotification("Message is empty", NOTIFICATION.WARNING);
  }
  chatFormBtn.setAttribute("disabled", "disabled");

  socket.emit("send_message", message, (error) => {
    if (error) {
      chatFormBtn.removeAttribute("disabled");
      return renderNotification(error, NOTIFICATION.DANGER);
    }

    chatFormBtn.removeAttribute("disabled");
    chatFormMessage.value = "";
    chatFormMessage.focus();
    renderNotification("Message delivered", NOTIFICATION.SUCCESS);
  });
});

sendLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return renderNotification(
      "Your browser does not support geolocation",
      NOTIFICATION.DANGER
    );
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
        renderNotification("Location shared", NOTIFICATION.SUCCESS);
        sendLocationBtn.removeAttribute("disabled");
      }
    );
  });
});
