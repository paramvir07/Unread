
import { useEffect } from "react";
import { connectSocket } from "./socket/socket";
import { useSetAtom } from "jotai";
import { clerkIdAtom } from "./atoms/atoms";
import Home from "./pages/Home";
import { useAuth } from "@clerk/clerk-react";

function App() {
  const { isLoaded, isSignedIn, getToken ,userId} = useAuth();
  const setClerkId = useSetAtom(clerkIdAtom);

  const connectToSocket = async () => {
    if (!isLoaded || !isSignedIn) return;

    setClerkId(userId);

    const token = await getToken();
    connectSocket(token);
    console.log(`Socket connected with clerk id: ${userId}`);
  }
  
  useEffect(() => {
    connectToSocket();

  }, [isLoaded, isSignedIn, userId, setClerkId]);

  return (
    <>
      <Home />
    </>
  );
}

export default App;