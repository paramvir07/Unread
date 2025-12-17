
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { connectSocket } from "./socket/socket";
import { useSetAtom } from "jotai";
import { clerkIdAtom } from "./atoms/atoms";
import Home from "./pages/Home";

function App() {
  const { user, isLoaded, isSignedIn } = useUser();
  const setClerkId = useSetAtom(clerkIdAtom);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    setClerkId(user.id);

    connectSocket(user.id);
    console.log(`Socket connected with clerk id: ${user.id}`);

  }, [isLoaded, isSignedIn, user?.id, setClerkId]);

  return (
    <>
      <Home />
    </>
  );
}

export default App;