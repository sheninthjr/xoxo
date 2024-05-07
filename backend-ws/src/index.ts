import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import { User } from "./SocketManager";
import url from "url";

const wss = new WebSocketServer({ port: 8080 });
const gameManager = new GameManager();

wss.on("connection", function connection(ws, req) {
  //@ts-ignore
  const userId = url.parse(req.url, true).query.userId;
  gameManager.addUser(new User(ws, userId as string));
  ws.on("close", () => gameManager.removeUser(ws));
});
