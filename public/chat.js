const socket = io();

// elements
const $chatForm = document.querySelector("#chat-form");
const $chatSubmitButton = document.querySelector("#chat-submit-button");
const $chatInput = $chatForm.querySelector("#chat-input");
const $chatMessages = document.querySelector("#chat-messages");
const $chatMessagesWrapper = document.querySelector("#chat-messages-wrapper");
const $chatNotifications = document.querySelector("#chat-notifications");
const $chatRoomUsers = document.querySelector("#chat-room-users");

// constants
const DATE_FORMAT = "hh:mm:ss";
const NOTIFICATION = {
  SUCCESS: "success",
  WARNING: "warning",
  DANGER: "danger",
};

// templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const roomUserTemplate = document.querySelector(
  "#room-user-template"
).innerHTML;
const notificationTemplate = document.querySelector(
  "#notification-template"
).innerHTML;

// helpers
const autoScroll = () => {
  const contentVisibleHeight = $chatMessagesWrapper.offsetHeight;
  const contentHeight = $chatMessagesWrapper.scrollHeight;

  if (contentVisibleHeight < contentHeight) {
    $chatMessagesWrapper.scrollTop = contentHeight;
    $chatMessagesWrapper.style.paddingRight = "1rem";
  }
};

const renederHtml = (element, template, props) => {
  const html = Mustache.render(template, {
    ...props,
  });
  element.insertAdjacentHTML("beforeend", html);
};

const renderNotification = (message, type, redirect = false) => {
  $chatNotifications.innerHTML = "";
  renederHtml($chatNotifications, notificationTemplate, { message, type });

  if (redirect) {
    $chatForm.classList.add("is-hidden");
    $chatNotifications.style.position = "initial";
  }

  setTimeout(() => {
    if (redirect) {
      location.href = "/index.html";
    }

    $chatNotifications.innerHTML = "";
  }, 2000);
};

// query params
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

/////////////////////////////////////////////////////////////////////

socket.on("message", ({ text, createdAt, username }) => {
  renederHtml($chatMessages, messageTemplate, {
    message: text,
    createdAt: moment(createdAt).format(DATE_FORMAT),
    username,
  });
  autoScroll();
});

socket.on("room_update", ({ room, users }) => {
  $chatRoomUsers.innerHTML = "";
  renederHtml($chatRoomUsers, roomUserTemplate, {
    room,
    users,
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    return renderNotification(error, NOTIFICATION.DANGER, true);
  }
  $chatInput.focus();
});

$chatForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const message = evt.target.elements.message.value;
  if (message === "") {
    return renderNotification("Message is empty", NOTIFICATION.WARNING);
  }
  $chatSubmitButton.setAttribute("disabled", "disabled");

  socket.emit("send_message", message, (error) => {
    if (error) {
      $chatSubmitButton.removeAttribute("disabled");
      return renderNotification(error, NOTIFICATION.DANGER);
    }

    $chatSubmitButton.removeAttribute("disabled");
    $chatInput.value = "";
    $chatInput.focus();
    renderNotification("Message delivered", NOTIFICATION.SUCCESS);
  });
});
