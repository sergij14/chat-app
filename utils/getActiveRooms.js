const getActiveRooms = (io) => {
  const rooms = Array.from(io.sockets.adapter.rooms).map((el) => el[0]);
  const sids = Array.from(io.sockets.adapter.sids).map((el) => el[0]);
  const result = [];

  rooms.forEach((room) => {
    if (!sids.includes(room)) {
      return result.push(room);
    }
    return [];
  });

  return result;
};

module.exports = getActiveRooms;
