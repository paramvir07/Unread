import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router";
import axios from "axios";
import type { User } from "@/pages/Home";
import { chatIdAtom, otherUserIdAtom } from "@/atoms/atoms";
import { useSetAtom } from "jotai";
import { MySkeleton } from "../ui/MySkeleton";

type ChatHomeProps = {
  users: User[];
};

const UserList = ({ users }: ChatHomeProps) => {
  const { userId } = useAuth();
  const setOtherUserId = useSetAtom(otherUserIdAtom);
  const setChatId = useSetAtom(chatIdAtom);
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();
  const apiUrl = import.meta.env.VITE_API_URL;

  const getChatId = async (otherUserId: string) => {
    // Hard block clicks when signed out (important)
    if (!isLoaded || !isSignedIn) return;

    setOtherUserId(otherUserId);

    try {
      const response = await axios.post(
        `${apiUrl}/api/user/getChatId`,
        { otherUserId },
        { withCredentials: true }
      );

      const chatId = response.data?.chat?.id;
      if (!chatId) return console.error("Chat ID not found at frontend!!");

      setChatId(chatId);
      navigate(`/chat/${chatId}`);
    } catch (error) {
      console.error("Error while loading chat: ", error);
    }
  };

  return (
    <main className="h-screen flex items-center justify-center bg-background">
      <div className="w-full h-full md:h-[550px] md:w-[380px] lg:h-[550px] lg:w-[380px] xl:h-[600px] xl:w-[400px] bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Top bar — ALWAYS visible */}
        <header className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Chats</span>
            <span className="text-xs text-muted-foreground">
              {isLoaded && isSignedIn ? (
                <>
                  {users.length} {users.length === 1 ? "user" : "users"}
                </>
              ) : (
                "Sign in to view your chats"
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="rounded-md px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:opacity-90"
                >
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
        {isLoaded && isSignedIn && (
          <div className="px-4 py-2 border-b">
            <Input
              placeholder="Search or start a new chat"
              className="h-9 text-sm"
            />
          </div>
        )}

        {/* Body */}
        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {/* Loading */}
            {!isLoaded && <MySkeleton />}

            {/* Signed out empty state */}
            {isLoaded && !isSignedIn && (
              <div className="p-6">
                <div className="rounded-xl border bg-muted/30 p-5 text-center">
                  <p className="text-sm font-medium">You’re not signed in</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Sign in to see your chats and start a new conversation.
                  </p>

                  <div className="mt-4 flex justify-center">
                    <SignInButton mode="modal">
                      <button
                        type="button"
                        className="rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90"
                      >
                        Sign In
                      </button>
                    </SignInButton>
                  </div>
                </div>
              </div>
            )}

            {/* Signed in list */}
            {isLoaded && isSignedIn && (
              <>
                {users
                  .filter((u) => u.clerkId !== userId)
                  .map((user) => {
                    return (
                      <button
                        key={user.id}
                        onClick={() => getChatId(user.id)}
                        type="button"
                        className="flex w-full items-center gap-3 px-4 py-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/70 focus:outline-none focus:bg-muted/80"
                      >
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage
                            alt={user.username}
                            src={user.imageUrl}
                          />
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium truncate">
                              {user.firstname} {user.lastname}
                            </p>
                          </div>

                          <div className="mt-0.5 flex items-center justify-between gap-2">
                            <p className="text-xs text-muted-foreground truncate">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}

                {users.length === 0 && <MySkeleton />}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </main>
  );
};

export default UserList;
