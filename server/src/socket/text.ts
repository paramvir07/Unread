import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

// Store userId -> socketId mapping
const userSockets = new Map<string, string>();

export function setupSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Step 1: User registers with their Clerk ID
    socket.on('register', (clerkUserId: string) => {
      userSockets.set(clerkUserId, socket.id);
      console.log(`User ${clerkUserId} registered with socket ${socket.id}`);
    });

    // Step 2: User joins a chat room
    socket.on('join-chat', (chatId: string) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat ${chatId}`);
    });

    // Step 3: Receive and broadcast message
    socket.on('send-message', async (data: {
      chatId: string;
      senderId: string;
      receiverId: string;
      content: string;
    }) => {
      console.log('Message received:', data);

      try {
        // Save to database using Prisma
        const message = await prisma.message.create({
          data: {
            chatId: data.chatId,
            senderId: data.senderId,
            content: data.content,
            createdAt: new Date()
          }
        });

        // Send to everyone in the chat room (including sender)
        io.to(data.chatId).emit('new-message', {
          id: message.id,
          chatId: data.chatId,
          senderId: data.senderId,
          content: data.content,
          createdAt: message.createdAt
        });

      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('message-error', { error: 'Failed to send message' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      // Remove user from online map
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
}