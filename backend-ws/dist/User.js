"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const GameManager_1 = require("./GameManager");
class UserManager {
    constructor() {
        this.games = new Map();
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new UserManager();
        return this.instance;
    }
    createGame(player1, player2, roomId, ws) {
        const game = {
            roomId: roomId,
            player1: player1,
            player2: player2,
            moves: GameManager_1.board,
            gametype: "init",
        };
        this.games.set(roomId, game);
    }
    makeMove(player1, player2, roomId, ws, row, col) {
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
                    ws.send(JSON.stringify({ message: `Player ${symbol} wins!`, roomId }));
                }
            }
            catch (e) {
                console.error("Error while moving");
            }
        }
        else {
            console.error("Invalid move");
        }
    }
    checkForWin(board, symbol) {
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === symbol &&
                board[i][1] === symbol &&
                board[i][2] === symbol) {
                return true;
            }
        }
        for (let i = 0; i < 3; i++) {
            if (board[0][i] === symbol &&
                board[1][i] === symbol &&
                board[2][i] === symbol) {
                return true;
            }
        }
        if (board[0][0] === symbol &&
            board[1][1] === symbol &&
            board[2][2] === symbol) {
            return true;
        }
        if (board[0][2] === symbol &&
            board[1][1] === symbol &&
            board[2][0] === symbol) {
            return true;
        }
        return false;
    }
    handleMessage(message, player1, player2, roomId, ws) {
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
exports.UserManager = UserManager;
