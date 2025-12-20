import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import userRoute from "./src/routes/routes";
import ngrok from "@ngrok/ngrok";
import "dotenv/config";
import { createServer } from "http";
import { clerkMiddleware } from '@clerk/express'
import cors from 'cors';
import { setupSocket } from "./src/socket/socketHandler";
const port = process.env.PORT;
const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
)

setupSocket(server);

app.use(morgan("dev"));
app.use(helmet());
app.use(clerkMiddleware());
app.use(express.json());
app.use("/api", userRoute);


app.get("/", async(req, res) => {

 return res.send("Welcome to chat app");
});

server.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});

ngrok
  .connect({ addr: port, authtoken: process.env.NGROK_AUTHTOKEN })
  .then((listener) => {
    console.log(`Ingress established at: ${listener.url()}`);
  });
