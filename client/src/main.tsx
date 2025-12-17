
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider} from "@clerk/clerk-react";
import Chat from "./pages/Chat.tsx";
import {TestMain} from "./components/test/TestMain.tsx";
import JotaiTest from "./components/test2/JotaiTest.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}


let router = createBrowserRouter([
  {
    path: "/",
    Component: App,

  },
  {
    path: "/chat/:chatId",
    Component: Chat
  },
  {
    path: "/test",
    Component: TestMain
  },
  {
    path: "/jotaiTest",
    Component: JotaiTest
  }
]); 



createRoot(document.getElementById("root")!).render(
  <>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
      </ClerkProvider>
  </>
);
