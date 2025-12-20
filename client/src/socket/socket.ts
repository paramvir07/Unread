import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
const apiUrl = import.meta.env.VITE_API_URL;

export const connectSocket = (token: string | null) => {
  if (socket) return socket;
  socket = io(apiUrl, {
    auth: { token },
    withCredentials: true
  });
  return socket;
}

export const getSocket = (token: string | null) => {
  if (!socket) {
    socket = io(apiUrl, {
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

