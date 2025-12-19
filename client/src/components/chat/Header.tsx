import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";
import { Separator } from "../ui/separator";
import { useNavigate } from "react-router";
import { useAtom } from "jotai";
import { onlineUserIdAtom } from "@/atoms/atoms";
import type { ChatData } from "@/pages/Chat";

type HeaderProps = {
  chatData: ChatData | null;
};

const Header = ({ chatData }: HeaderProps) => {
  const [onlineUserId] = useAtom(onlineUserIdAtom);

  // Loading
  if (!chatData) return <div></div>;

  console.log(`chat data from header: ${chatData}`);

  const chat = chatData?.chat;

  const loggedInUser = chatData?.userId;

  const otherChatUser = chat?.chatUsers?.find(
    (cu) => cu.userId != loggedInUser
  );

  const otherUserId = otherChatUser?.userId;
  console.log(`other user id: ${otherUserId}, online user id:${onlineUserId}`);

  const navigate = useNavigate();
  return (
    <>
      <div className="flex items-center m-3 gap-3">
        <ChevronLeft
          size={30}
          onClick={() => {
            navigate("/");
          }}
        />

        <Avatar>
          <AvatarImage src={otherChatUser?.user.imageUrl} />
        </Avatar>

        <div>
          <div className="text-foreground font-medium text-lg">
            {otherChatUser?.user.username}
          </div>

          <div className="text-muted-foreground text-sm">
            {onlineUserId === otherUserId ? "Online" : "Offline"}
          </div>
        </div>
      </div>
      <Separator />
    </>
  );
};

export default Header;
