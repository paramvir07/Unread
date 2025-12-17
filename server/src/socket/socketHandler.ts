import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { prisma } from "../lib/prisma";
import { error } from "console";

export const setupSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });
  io.use((socket, next) => {
    const clerkId = socket.handshake.auth.clerkId;
    socket.data.clerkId = clerkId;
    next();
  });
  io.on("connection", (socket) => {
    console.log(
      `Socket connected with socket id: ${socket.id} and clerk id: ${socket.data.clerkId}`
    );
    socket.on("join-room", async ({ chatId, clerkId }) => {
      if (!chatId) return console.log({ error: "Chat id not found!!" });
      socket.join(chatId);
      console.log(`Clerk user ${socket.data.clerkId} joined room ${chatId}`);
      try {
        const user = await prisma.user.findUnique({
          where: {
            clerkId,
          },
        });

        if (!user)
          return console.log({
            error: "User not found during sending message!!",
          });

        socket
          .to(chatId)
          .emit("check-online", { userId: user.id });
      } catch (err) {
        console.error({
          error: "Error while sending message at backend!!",
          message: err,
        });
      }
    });

    socket.on("send-message", async ({ clerkId, chatId, message }) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            clerkId,
          },
        });

        if (!user)
          return console.log({
            error: "User not found during sending message!!",
          });

        const sendMessage = await prisma.message.create({
          data: {
            content: message,
            userId: user.id,
            chatId,
          },
        });

        io.to(chatId).emit("chat-message", { message: sendMessage });
      } catch (err) {
        console.error({
          error: "Error while sending message at backend!!",
          message: err,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
  return io;
};
