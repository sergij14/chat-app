const users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = username.trim().toLowerCase();

  if (!username || !room) {
    return;
  }

  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  if (existingUser) {
    return;
  }

  const user = { username, room, id };
  users.push(user);

  return { user };
};

const removeUser = (id) => users.filter((user) => user.id !== id);

const getUser = (id) => users.find((user) => user.id === id);

const getRoomUsers = (room) => {
  const fitleredRoomUsers = users.filter((user) => user.room === room);
  return fitleredRoomUsers;
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getRoomUsers,
};
