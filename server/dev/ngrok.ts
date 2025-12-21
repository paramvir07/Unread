import ngrok from "@ngrok/ngrok";

const port = 3000;

const token = process.env.NGROK_AUTHTOKEN;
if (!token) {
  throw new Error("NGROK_AUTHTOKEN not set");
}

const listener = await ngrok.connect({
  addr: port,
  authtoken: token,
});

console.log(`Ngrok tunnel: ${listener.url()}`);
