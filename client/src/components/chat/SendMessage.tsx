import { Send, Smile } from "lucide-react";
import { Input } from "../ui/input";
import { useRef, useState } from "react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { useSetAtom } from "jotai";
import { isTypingAtom } from "@/atoms/atoms";

const SendMessage = ({ sendMessage }: { sendMessage: (t: string) => void }) => {
  const [message, setMessage] = useState("");
  const setisTyping = useSetAtom(isTypingAtom);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSubmit = () => {
    if (!message.trim()) return;
    setEmojiPicker(false);
    sendMessage(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const onEmojiCLick = (emojiData: EmojiClickData) => {
    const input = inputRef.current;
    if (!input) return;

    const emoji = emojiData.emoji;

    const start = input.selectionStart ?? message.length;
    const end = input.selectionEnd ?? message.length;

    const next = message.slice(0, start) + emoji + message.slice(end);

    setMessage(next);
  };

  const handleTyping = () => {
    setisTyping(true);

    timerRef.current && clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setisTyping(false)
    }, 3000);

  }
  return (
    <>

      {emojiPicker && (
        <EmojiPicker onEmojiClick={onEmojiCLick} theme="dark" height={320} />
      )}
      <div className="flex items-center gap-2 px-2 py-2 border-t">
        <Smile onClick={() => setEmojiPicker((v) => !v)} />
        <Input
          placeholder="Type a message"
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onBlur={()=>setisTyping(false)}
          onKeyDown={handleKeyDown}
          value={message}
          ref={inputRef}
        />
        <div className="p-2">
          <Send size={22} onClick={handleSubmit} />
        </div>
      </div>
    </>
  );
};

export default SendMessage;
