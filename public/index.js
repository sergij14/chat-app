const socket = io({ query: { indexPage: true } });

// elements
const $chatActiveRoomSelectWrapper = document.querySelector(
  "#chat-active-room-select-wrapper"
);
const $chatRoomInput = document.querySelector("#chat-room-input");

// templates
const activeRoomTemplate = document.querySelector(
  "#active-room-template"
).innerHTML;

socket.on("room_list", (rooms) => {
  const html = Mustache.render(activeRoomTemplate, {
    rooms,
    roomsCount: rooms.length,
  });

  $chatActiveRoomSelectWrapper.innerHTML = "";
  $chatActiveRoomSelectWrapper.insertAdjacentHTML("beforeend", html);

  const $chatActiveRoomSelect = document.querySelector(
    "#chat-active-room-select"
  );

  if (!rooms.length) {
    $chatActiveRoomSelect.setAttribute("disabled", "disabled");
  } else {
    $chatActiveRoomSelect.removeAttribute("disabled");
  }

  $chatActiveRoomSelect.addEventListener("change", (evt) => {
    const { value } = evt.target;
    if (value) {
      $chatRoomInput.removeAttribute("required");
      $chatRoomInput.removeAttribute("room");
      $chatRoomInput.setAttribute("disabled", "disabled");

      $chatActiveRoomSelect.setAttribute("name", "room");
    } else {
      $chatRoomInput.setAttribute("required", "required");
      $chatRoomInput.setAttribute("room", "room");
      $chatRoomInput.removeAttribute("disabled");

      $chatActiveRoomSelect.removeAttribute("name");
    }
  });
});
