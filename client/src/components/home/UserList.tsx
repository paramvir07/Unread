// types

type ChatHomeProps = {
  users: User[];
};

// shadcn/ui imports
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router";
import axios from "axios";
import type { User } from "@/pages/Home";
import { chatIdAtom, otherUserIdAtom } from "@/atoms/atoms";
import { useSetAtom } from "jotai";

const UserList = ({ users }: ChatHomeProps) => {
  const setOtherUserId = useSetAtom(otherUserIdAtom);
  const setChatId = useSetAtom(chatIdAtom);
  const navigate = useNavigate();

  const getChatId = async (otherUserId: string) => {
    setOtherUserId(otherUserId);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/getChatId",
        { otherUserId },
        { withCredentials: true }
      );
      const data = response.data;
      const chatId = data.chat.id;

      if (!chatId) return console.error("Chat ID not found at frontend!!");
      setChatId(chatId);
      return navigate(`/chat/${chatId}`);
    } catch (error) {
      return console.error("Error while loading chat: ", error);
    }
  };

  return (
      <main className="h-screen flex items-center justify-center bg-background">
        <div className="w-full h-full md:h-[550px] md:w-[380px] lg:h-[550px] lg:w-[380px]  xl:h-[600px] xl:w-[400px]  bg-card border rounded-xl shadow-sm overflow-hidden">
        {/* Top bar */}

        <header className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Chats</span>
            <span className="text-xs text-muted-foreground">
              {users.length} {users.length === 1 ? "user" : "users"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-500 rounded-md px-2 py-1 cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>

        {/* Search */}

        <div className="px-4 py-2 border-b">
          <Input
            placeholder="Search or start a new chat"
            className="h-9 text-sm"
            // wire value/onChange later
          />
        </div>

        {/* Contact list */}
        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {users.map((user) => {
              const initials = `${user.firstname?.[0] ?? ""}${
                user.lastname?.[0] ?? ""
              }`
                .toUpperCase()
                .trim();

              return (
                <button
                  key={user.id}
                  onClick={() => getChatId(user.id)}
                  type="button"
                  className="flex w-full items-center gap-3 px-4 py-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/70 focus:outline-none focus:bg-muted/80"
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    /
                    <AvatarImage alt={user.username} />
                    <AvatarFallback className="text-[11px] font-medium">
                      {initials || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium truncate">
                        {user.firstname} {user.lastname}
                      </p>
                      {/* Static time placeholder – replace when you add real data */}
                      {/* <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        12:45
                      </span> */}
                    </div>

                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <p className="text-xs text-muted-foreground truncate">
                        @{user.username}
                      </p>

                      {/* Static unread badge – swap for real count later or remove */}
                      {/* <Badge
                        variant="secondary"
                        className="px-2 py-0 h-5 min-w-[1.5rem] flex items-center justify-center rounded-full text-[10px] font-medium"
                      >
                        3
                      </Badge> */}
                    </div>
                  </div>
                </button>
              );
            })}

            {users.length === 0 && (
              <div className="flex flex-col items-center gap-5 mt-10">
                <Skeleton className="h-14 w-[300px] rounded-xl" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </main>
  );
};

export default UserList;
