const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequestSchema");

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
      socket.join(roomId);
    });
    socket.on("sendMessage", async ({ firstName, userId, id, text }) => {
      try {
        const connection = await ConnectionRequest.findOne({
          $or: [
            { fromUserId: userId, toUserId: id },
            { fromUserId: id, toUserId: userId },
          ],
          status: "accepted",
        });

        if (!connection) {
          return;
        }

        const roomId = getSecretRoomId({ userId, id });
        let chat = await Chat.findOne({
          participants: { $all: [userId, id] },
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, id],
            messages: [],
          });
        }

        chat.messages.push({ senderId: userId, text });
        await chat.save();
        io.to(roomId).emit("messageReceived", { firstName, text });
      } catch (error) {
        console.log(error);
      }
    });
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
