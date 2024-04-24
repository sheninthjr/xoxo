import { board } from "./GameManager";

export type GameType = "init" | "started" | "ended";

export interface Game {
  roomId: string;
  player1: string;
  player2: string;
  moves: string[][];
  gametype: GameType;
}

export class UserManager {
  private static instance: UserManager;
  private games: Map<string, Game>;

  constructor() {
    this.games = new Map<string, Game>();
  }
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new UserManager();
    return this.instance;
  }
  createGame(player1: string, player2: string, roomId: string, ws: any) {
    const game: Game = {
      roomId: roomId,
      player1: player1,
      player2: player2,
      moves: board,
      gametype: "init",
    };
    this.games.set(roomId, game);
  }
  makeMove(
    player1: string,
    player2: string,
    roomId: string,
    ws: any,
    row: number,
    col: number
  ) {
    const room = this.games.get(roomId);
    if (!room) {
      console.log("Room not Found");
      return;
    }
    let symbol = player1 === room.player1 ? "O" : "X";
    if (room.moves[row][col] === "-") {
      room.moves[row][col] = symbol;
      this.games.set(roomId, room);
      try {
        ws.send(JSON.stringify({ message: "Move made successfully", roomId }));
        console.log(this.games);
        if (this.checkForWin(room.moves, symbol)) {
          console.log(`Player ${symbol} wins!`);
          ws.send(
            JSON.stringify({ message: `Player ${symbol} wins!`, roomId })
          );
        }
      } catch (e) {
        console.error("Error while moving");
      }
    } else {
      console.error("Invalid move");
    }
  }
  checkForWin(board: string[][], symbol: string): boolean {
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] === symbol &&
        board[i][1] === symbol &&
        board[i][2] === symbol
      ) {
        return true;
      }
    }
    for (let i = 0; i < 3; i++) {
      if (
        board[0][i] === symbol &&
        board[1][i] === symbol &&
        board[2][i] === symbol
      ) {
        return true;
      }
    }
    if (
      board[0][0] === symbol &&
      board[1][1] === symbol &&
      board[2][2] === symbol
    ) {
      return true;
    }
    if (
      board[0][2] === symbol &&
      board[1][1] === symbol &&
      board[2][0] === symbol
    ) {
      return true;
    }
    return false;
  }
  handleMessage(
    message: string,
    player1: string,
    player2: string,
    roomId: string,
    ws: any
  ) {
    const data = JSON.parse(message);
    if (data.type === "makeMove") {
      const { row, col } = data;
      this.makeMove(player1, player2, roomId, ws, row, col);
      return;
    }
  }
  logger() {
    console.log(this.games);
  }
}
