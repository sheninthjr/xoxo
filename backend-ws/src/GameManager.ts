import { WebSocket } from "ws";
import { Game } from "./Game";
import { SocketManager, User } from "./SocketManager";

export class GameManager {
  private games: Game[];
  private pendingGameId: string | null;
  private users: User[];

  constructor() {
    this.games = [];
    this.pendingGameId = null;
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
        if (this.pendingGameId) {
          const game = this.games.find((x) => x.gameId === this.pendingGameId);
          if (!game) {
            console.error("Pending game not found");
            return;
          }
          if (user.userId === game.player1) {
            console.error("User is already part of the pending game");
            return;
          }
          game.player2 = user.userId;
          SocketManager.getInstance().addUser(user, game.gameId);
          this.pendingGameId = null;
          const roomId = game.gameId;
          const gameStartedMessage = JSON.stringify({
            type: "game_started",
            payload: { roomId },
          });
          SocketManager.getInstance().broadcast(roomId, gameStartedMessage);
        } else {
          const game = new Game(user.userId, null);
          this.games.push(game);
          this.pendingGameId = game.gameId;
          SocketManager.getInstance().addUser(user, game.gameId);
        }
      }
      if (message.type === "move") {
        const gameId: string = message.gameId.gameId;
        const player: string = message.player;
        const game = this.games.find((game) => game.gameId === gameId);
        if (game) {
          game.makeMove(user.socket, player, message.move);
        } else {
          console.log("No game found with gameId:", gameId);
        }
      }
    });
  }
}
