import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import userRoute from "./src/routes/routes";
import { createServer } from "http";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import { setupSocket } from "./src/socket/socketHandler";

const port = Number(process.env.PORT || 3000);
const isProd = process.env.NODE_ENV === "production";

const app = express();
const server = createServer(app);

const clientUrl = process.env.CLIENT_URL;

app.use(clerkMiddleware());
app.use(
  cors({
    origin: isProd
      ? clientUrl
        ? [clientUrl]
        : false
      : clientUrl
      ? [clientUrl]
      : true,
    credentials: true,
  })
);

setupSocket(server);

app.use(morgan(isProd ? "combined" : "dev"));
app.use(helmet());
app.use(express.json());

app.use("/api", userRoute);

app.get("/", (_req, res) => {
  res.send("Welcome to chat app");
});

server.listen(port, "0.0.0.0", () => {
  console.log(`App is running on port ${port}`);
});
