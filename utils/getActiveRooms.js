const getActiveRooms = (io) => {
  const roomsObj = Object.fromEntries(io.sockets.adapter.rooms);
  const sidsObj = Object.fromEntries(io.sockets.adapter.sids);
  const result = [];

  Object.keys(roomsObj).forEach((room) => {
    if (sidsObj[room]) {
      return;
    }
    result.push(room);
  });

  return result;
};

module.exports = getActiveRooms;
