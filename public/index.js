const socket = io({ query: { indexPage: true } });

socket.on("room_list", (data) => {
  console.log(data);
});
