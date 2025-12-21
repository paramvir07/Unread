import {
  chatMessagesAtom,
  isTypingAtom,
  showTypingIndicatorAtom,
} from "@/atoms/atoms";
import ChatArea from "@/components/chat/ChatArea";
import Header from "@/components/chat/Header";
import SendMessage from "@/components/chat/SendMessage";
import {  getSocket } from "@/socket/socket";
import axios from "axios";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import type { User } from "./Home";
import { useAuth } from "@clerk/clerk-react";
import type { Socket } from "socket.io-client";
import { MySkeleton } from "@/components/ui/MySkeleton";
import { useAuthedApi } from "@/api/authedApi";

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
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const setMessages = useSetAtom(chatMessagesAtom);
  const { chatId } = useParams();
  const { getToken, isLoaded, userId } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isTyping] = useAtom(isTypingAtom);
  const setShowTypingIndicator = useSetAtom(showTypingIndicatorAtom);
  const apiUrl = import.meta.env.VITE_API_URL;
  const api = useAuthedApi();

  const loadChat = async () => {
    try {
      const response = await api.post(
        `${apiUrl}/api/user/loadChat`,
        { chatId }
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
      socket.emit("join-room", { chatId });
      console.log(`Joined room: ${chatId}`);

      socket.on("is-typing", () => {
        setShowTypingIndicator(true);
      });

      socket.on("not-typing", () => {
        setShowTypingIndicator(false);
      });

      socket.on("chat-message", ({ message }) => {
        setMessages((prev) => [...prev, message]);
        setShowTypingIndicator(false);
      });
    } catch (error) {
      console.error("Socket error:", error);
    }
  };

  const sendMessage = (message: string) => {
    socketRef.current?.emit("send-message", {
      chatId,
      message,
    });
  };

  useEffect(() => {
    if (!chatId || !isLoaded || !userId) return;

    loadChat();

    socketSetup();

    return () => {
      socketRef.current?.emit("leave-room", { chatId });
      socketRef.current?.off("check-online");
      socketRef.current?.off("chat-message");
      socketRef.current?.off("is-typing");
      socketRef.current?.off("not-typing");
      console.log(`Left room: ${chatId}`);
    };
  }, [chatId, isLoaded, userId]);


  // User Typing
  useEffect(() => {
    isTyping && socketRef.current?.emit("is-typing", { chatId });

    !isTyping && socketRef.current?.emit("not-typing", { chatId });
  }, [isTyping]);

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
