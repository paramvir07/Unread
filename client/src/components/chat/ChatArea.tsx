import type { ChatData } from "@/pages/Chat";
import { ScrollArea } from "../ui/scroll-area";
import { useAtom } from "jotai";
import { chatMessagesAtom } from "@/atoms/atoms";
import { useEffect, useRef } from "react";


type ChatAreaProps = {
  chatData: ChatData | null;
};
type MessageBubbleProps = {
  isMe: boolean
  message: string
  createdAt: string
}



const MessageBubble = ({isMe, message, createdAt}: MessageBubbleProps) => {

  const time = new Date(createdAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })
  return (
    <div className={` flex flex-col px-2 py-0.5 w-fit rounded-sm mb-4 ${isMe ? "bg-muted-foreground" : "bg-primary/70 ml-auto"}`}>
      <div className="text-card py-1">{message}</div>
      <div className="ml-auto text-muted text-[13px]">{time}</div>
    </div>
  );
};

const ChatArea = ({ chatData }: ChatAreaProps) => {
  const [messages, setMessages] = useAtom(chatMessagesAtom)
  const bottomRef = useRef<HTMLDivElement>(null)
  // Loading
  if (!chatData) return <div></div>;

  const chat = chatData.chat;

  const loggedInUser = chatData.userId;

  const sortedMessages = [...chat.messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  useEffect(() => {
    setMessages(sortedMessages)
    
  }, [])

  useEffect(() => {
  // if (!bottomRef.current) return

  bottomRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "end",
  })
}, [messages])
  
  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="p-4 w-full h-full">
        {messages.map((m,index) => {
          const isMe = m.userId === loggedInUser;
          
          return (
              <MessageBubble key={index} isMe={isMe} message={m.content} createdAt={m.createdAt}/>
          );
        })}
        <div ref={bottomRef} />
      </ScrollArea>
    </div>
  );
};

export default ChatArea;
