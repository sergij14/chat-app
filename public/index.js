const socket = io({ query: { indexPage: true } });

// elements
const $chatActiveRoomSelectWrapper = document.querySelector(
    "#chat-active-room-select-wrapper"
  );
const $chatActiveRoomSelect = document.querySelector(
  "#chat-active-room-select"
);
const $chatRoomInput = document.querySelector("#chat-room-input");

// templates
const activeRoomTemplate = document.querySelector(
  "#active-room-template"
).innerHTML;

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

socket.on("room_list", (rooms) => {
  if (rooms.length) {
    $chatActiveRoomSelectWrapper.classList.remove("is-hidden");
  } else {
    $chatActiveRoomSelectWrapper.classList.add("is-hidden");
  }

  const html = Mustache.render(activeRoomTemplate, { rooms });

  Array.from($chatActiveRoomSelect.children).forEach((node) => {
    if (node.value) $chatActiveRoomSelect.removeChild(node);
  });

  $chatActiveRoomSelect.insertAdjacentHTML("beforeend", html);
});
