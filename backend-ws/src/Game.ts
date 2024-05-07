import { WebSocket } from "ws";
import { SocketManager } from "./SocketManager";

export class Game {
  public gameId: string;
  public player1: string;
  public player2: string | null;
  private board: string[][];
  private startTime: Date;
  private symbolQueue: string[];
  constructor(
    player1: string,
    player2: string | null,
    gameId?: string,
    startTime?: Date
  ) {
    this.player1 = player1;
    this.player2 = player2;
    this.gameId = gameId ?? crypto.randomUUID();
    this.board = [
      ["-", "-", "-"],
      ["-", "-", "-"],
      ["-", "-", "-"],
    ];
    this.startTime = new Date();
    this.symbolQueue = [];
  }
  makeMove(
    socket: WebSocket,
    player: string,
    move: {
      row: string;
      col: string;
    }
  ) {
    const { row, col } = move;
    const rowIndex = parseInt(row);
    const colIndex = parseInt(col);
    const symbol = this.player1 === player ? "X" : "O";
    console.log(symbol);
    try {
      if (this.board[rowIndex][colIndex] === "-") {
        // if (
        //   this.symbolQueue.length > 0 &&
        //   this.symbolQueue[this.symbolQueue.length - 1] === symbol
        // ) {
        //   socket.send(JSON.stringify({ type: "board", board: this.board }));
        //   console.log("Invalid move: Same symbol as last move");
        //   return;
        // }
        this.board[rowIndex][colIndex] = symbol;
        console.log("Move pushed Successfully");
        const message = JSON.stringify({ type: "move_made", row, col, symbol });
        SocketManager.getInstance().broadcast(this.gameId, message);
        if (this.checkForWin(this.board, symbol)) {
          SocketManager.getInstance().broadcast(
            this.gameId,
            JSON.stringify({ type: "game_over", row, col, winner: symbol })
          );
        }
        console.log(this.board);
      }
    } catch (e) {
      return;
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
}
