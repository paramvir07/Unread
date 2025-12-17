import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (clerkId: string | null) => {
  if (socket) return socket;
  socket = io("http://localhost:3000", {
    auth: { clerkId },
    withCredentials: true
  });
  return socket;
}

export const getSocket=()=>{
    if (!socket) {
       throw new Error("Socket not connected!!")
    }
    return socket;
}

export const disconnectSocket=()=>{
    if(socket) socket.disconnect();
    console.log("Socket Disconnected");
    
    socket = null;
}

