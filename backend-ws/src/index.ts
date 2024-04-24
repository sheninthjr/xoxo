import { WebSocketServer } from "ws";
import { UserManager } from "./User";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    const { type, player1, player2, roomId, row, col } = JSON.parse(
      data.toString()
    );
    const userManager = UserManager.getInstance();
    if (type === "createGame") {
      userManager.createGame(player1, player2, roomId, ws);
    } else if (type === "makeMove") {
      userManager.makeMove(player1, player2, roomId, ws, row, col);
    }
    UserManager.getInstance().logger();
  });

  ws.send("something");
});
