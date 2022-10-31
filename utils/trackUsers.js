let users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return { error: "Data was not provided" };
  }

  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  if (existingUser) {
    return { error: "User exists" };
  }

  const user = { username, room, id };
  users.push(user);

  return { user };
};

const removeUser = (id) => {
  const user = users.find((user) => user.id === id);
  users = users.filter((user) => user.id !== id);
  return user;
};

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
