"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const User_1 = require("./User");
const wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on("connection", function connection(ws) {
    ws.on("error", console.error);
    ws.on("message", function message(data) {
        const { type, player1, player2, roomId, row, col } = JSON.parse(data.toString());
        const userManager = User_1.UserManager.getInstance();
        if (type === "createGame") {
            userManager.createGame(player1, player2, roomId, ws);
        }
        else if (type === "makeMove") {
            userManager.makeMove(player1, player2, roomId, ws, row, col);
        }
        User_1.UserManager.getInstance().logger();
    });
    ws.send("something");
});
