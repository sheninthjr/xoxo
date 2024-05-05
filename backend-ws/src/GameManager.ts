import { WebSocket } from "ws";
import { Game } from "./Game";
import { SocketManager, User } from "./SocketManager";

export class GameManager {
  private games: Game[];
  private pendingUser: string | null;
  private users: User[];
  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
  }
  addUser(user: User) {
    this.users.push(user);
    this.handleMessage(user);
  }
  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user.socket !== socket);
  }
  private handleMessage(user: User) {
    user.socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === "init_game") {
        if (this.pendingUser) {
          const data: string = message.userId;
          const game = new Game(this.pendingUser, data);
          this.games.push(game);
          const roomId = game.gameId;
          const gameStartedMessage = JSON.stringify({
            type: "game_started",
            payload: { roomId },
          });
          SocketManager.getInstance().addUser(user, roomId);
          SocketManager.getInstance().broadCast(roomId, gameStartedMessage);
          console.log("Game Started");
          this.pendingUser = null;
        } else {
          this.pendingUser = message.userId;
        }
      }
      if (message.type === "move") {
        const gameId: string = message.gameId.gameId;
        const player: string = message.player;
        const game = this.games.find((game) => game.gameId === gameId.trim());
        if (game) {
          game.makeMove(user.socket, player, message.move);
        } else {
          console.log("No game found with gameId:", gameId);
        }
      }
    });
  }
}
