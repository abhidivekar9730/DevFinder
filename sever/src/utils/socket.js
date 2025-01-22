const socket = require("socket.io");
const crypto = require("crypto");

const getSecretRoomId = ({ userId, id }) => {
  return crypto
    .createHash("sha256")
    .update([userId, id].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: [
        "https://dev-tinder03.vercel.app",
        "https://devmatch.tusharshitole.site",
        "http://localhost:5173",
      ],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, id }) => {
      const roomId = getSecretRoomId({ userId, id });
      console.log("joining Romm" + roomId);
      socket.join(roomId);
    });
    socket.on("sendMessage", ({ firstName, userId, id, text }) => {
      const roomId = getSecretRoomId({ userId, id });
      console.log(firstName, text);
      io.to(roomId).emit("messageReceived", { firstName, text });
    });
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
