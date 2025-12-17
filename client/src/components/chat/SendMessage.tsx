import { Send } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";

const SendMessage = ({sendMessage}: {sendMessage: (t:string)=> void}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    sendMessage(message);
    setMessage("");
  };
  return (
    <div className="flex items-center gap-2 px-2 py-2 border-t">
      <Input
        placeholder="Type a message"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <div className="p-2">
        <Send size={22} onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default SendMessage;
