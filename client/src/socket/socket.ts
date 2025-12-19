import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token: string | null) => {
  if (socket) return socket;
  socket = io("http://localhost:3000", {
    auth: { token },
    withCredentials: true
  });
  return socket;
}

export const getSocket = (token: string | null) => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      auth: { token },
      withCredentials: true,
    });
  }
  return socket;
};

export const disconnectSocket=()=>{
    if(socket) socket.disconnect();
    console.log("Socket Disconnected");
    
    socket = null;
}

