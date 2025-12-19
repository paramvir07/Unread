import {
  chatMessagesAtom,
  clerkIdAtom,
  onlineUserIdAtom,
  otherUserIdAtom,
} from "@/atoms/atoms";
import ChatArea from "@/components/chat/ChatArea";
import Header from "@/components/chat/Header";
import SendMessage from "@/components/chat/SendMessage";
import { getSocket } from "@/socket/socket";
import axios from "axios";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { MySkeleton } from "@/components/MySkeleton";
import type { User } from "./Home";
import { useAuth } from "@clerk/clerk-react";
import type { Socket } from "socket.io-client";

type ChatUser = {
  id: string;
  role: "MEMBER" | "ADMIN";
  lastReadAt: string | null;
  joinedAt: string;
  leftAt: string | null;
  mutedUntil: string | null;
  user: User;
  userId: string;
  chatId: string;
};

export type Message = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  chatId: string;
};

type Chat = {
  id: string;
  createdAt: string;
  chatType: string;
  groupIcon: string | null;
  groupName: string | null;
  chatUsers: ChatUser[];
  groupAdminUserId: string | null;
  messages: Message[];
};

export type ChatData = {
  success: boolean;
  chat: Chat;
  userId: string;
};

const Chat = () => {
  const [otherUserId] = useAtom(otherUserIdAtom);
  const setOnlineUserId = useSetAtom(onlineUserIdAtom);
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [clerkId] = useAtom(clerkIdAtom);
  const setMessages = useSetAtom(chatMessagesAtom);
  const { chatId } = useParams();
  const { getToken } = useAuth();
  const socketRef =useRef<Socket | null>(null)

  const loadChat = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/loadChat",
        { chatId },
        { withCredentials: true }
      );
      const data = response.data;
      setChatData(data);
    } catch (error) {
      console.error("Error while loading chat: ", error);
    }
  };

 

  const socketSetup = async () => {
    const token = await getToken();
    const socket = getSocket(token);
    socketRef.current = socket;
    try {
      socket.emit("join-room", { chatId, clerkId });
      console.log(`Joined room: ${chatId}`);

      socket.on("check-online", ({ userId }) => {
        setOnlineUserId(userId);
        console.log("user is online bro");
      });

      socket.on("chat-message", ({ message }) => {
        setMessages((prev) => [...prev, message]);
      });
      return () => {
        socket?.emit("leave-room", { chatId });
        console.log(`Left room: ${chatId}`);
      };
    } catch (error) {
      console.error("Socket error:", error);
    }
  };

  const sendMessage = (message: string) => {
    socketRef.current?.emit("send-message", {
      clerkId,
      chatId,
      otherUserId,
      message,
    });
  };

  useEffect(() => {
    if (!chatId) return;

    loadChat();

    socketSetup();
  }, [chatId]);

  return (
    <>
      <main className="h-screen flex items-center justify-center bg-background">
        <div className="w-full h-full md:h-[550px] md:w-[380px] lg:h-[550px] lg:w-[380px] xl:h-[600px] xl:w-[400px] bg-card border rounded-xl shadow-sm overflow-hidden">
          {!chatData ? (
            <MySkeleton />
          ) : (
            <div className="flex flex-col h-full">
              <Header chatData={chatData} />
              <ChatArea chatData={chatData} />
              <SendMessage sendMessage={sendMessage} />
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Chat;
