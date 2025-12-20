import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";
import { Separator } from "../ui/separator";
import { useNavigate } from "react-router";
import type { ChatData } from "@/pages/Chat";

type HeaderProps = {
  chatData: ChatData | null;
};

const Header = ({ chatData }: HeaderProps) => {
  // Loading
  if (!chatData) return <div></div>;

  const chat = chatData?.chat;

  const loggedInUser = chatData?.userId;

  const otherChatUser = chat?.chatUsers?.find(
    (cu) => cu.userId != loggedInUser
  );

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
            {otherChatUser?.user.isOnline ? "Online" : "Offline"}
          </div>
        </div>
      </div>
      <Separator />
    </>
  );
};

export default Header;
