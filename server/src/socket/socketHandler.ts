import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { prisma } from "../lib/prisma";
import { verifyToken } from "@clerk/backend";
import 'dotenv/config'

export const setupSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(async(socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error("UNAUTHORIZED"));

    try {
      const verified = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
        authorizedParties: ["http://localhost:5173"]
      });
      socket.data.clerkId = verified.sub;
      return next();
    } catch (error) {
      return next(new Error("UNAUTHORIZED"));
    }
  });

  io.on("connection", async(socket) => {
    console.log(
      `Socket connected with socket id: ${socket.id} and clerk id: ${socket.data.clerkId}`
    );
          try {
            const user = await prisma.user.update({
              where: {
                clerkId: socket.data.clerkId,
              },
              data: {
                isOnline: true
              }
            });

            if (!user)
              return console.log({
                error: "User not found setting isOnline flag!!",
              });

          } catch (err) {
            console.error({
              error: "Error while sending setting isOnline flag!!!",
              message: err,
            });
          }
    socket.on("join-room", ({ chatId }) => {
      if (!chatId) return console.log({ error: "Chat id not found!!" });
      socket.join(chatId);
      console.log(`Clerk user ${socket.data.clerkId} joined room ${chatId}`);

    });

    socket.on("send-message", async ({ chatId, message }) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            clerkId: socket.data.clerkId,
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

    socket.on('leave-room', ({chatId}) => {  
      if (!chatId) return console.log({ error: "Chat id not found!!" });
      socket.leave(chatId);
      console.log(`Clerk user ${socket.data.clerkId} left room ${chatId}`);
    })

    socket.on("is-typing", ({ chatId }) => {
      socket.to(chatId).emit("is-typing")
    })

    socket.on("not-typing", ({ chatId }) => {
      socket.to(chatId).emit("not-typing");
    });


    socket.on("disconnect", async() => {
      console.log(`Socket disconnected: ${socket.id}`);
      try {
        const user = await prisma.user.update({
          where: {
            clerkId: socket.data.clerkId,
          },
          data: {
            isOnline: false,
          },
        });

        if (!user)
          return console.log({
            error: "User not found setting isOnline flag!!",
          });
      } catch (err) {
        console.error({
          error: "Error while sending setting isOnline flag!!!",
          message: err,
        });
      }
    });
  });
  return io;
};
