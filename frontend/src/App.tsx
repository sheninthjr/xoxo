import React, { useState, useEffect } from "react";
function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [board, setBoard] = useState<string[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      setSocket(ws);
    };
    ws.onclose = () => {
      setSocket(null);
    };
  }, [player1, player2]);

  const handleStartGame = () => {
    if (socket && player1 && player2) {
      socket.send(
        JSON.stringify({
          type: "createGame",
          player1,
          player2,
          roomId: "61864605-1448-47ee-baa1-bffd3750c489",
        })
      );
    } else {
      console.error(
        "WebSocket connection not established or player names missing"
      );
    }
  };

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (socket && player1 && player2) {
      if (board[rowIndex][colIndex] === "") {
        const newBoard = [...board];
        newBoard[rowIndex][colIndex] = currentPlayer;
        setBoard(newBoard);

        const moveData = {
          type: "makeMove",
          roomId: "61864605-1448-47ee-baa1-bffd3750c489",
          row: rowIndex,
          col: colIndex,
        };
        socket.send(JSON.stringify(moveData));

        // Toggle current player
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      }
    } else {
      console.error(
        "WebSocket connection not established or player names missing"
      );
    }
  };

  const renderCell = (rowIndex: number, colIndex: number) => {
    return (
      <td key={colIndex}>
        <button onClick={() => handleCellClick(rowIndex, colIndex)}>
          {board[rowIndex][colIndex]}
        </button>
      </td>
    );
  };

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      <div>
        <label>Player 1:</label>
        <input
          type="text"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
        />
      </div>
      <div>
        <label>Player 2:</label>
        <input
          type="text"
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
        />
      </div>
      <button onClick={handleStartGame}>Start Game</button>
      <div>
        <h2>Game Board</h2>
        <table>
          <tbody>
            {board.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <p>Current Player: {currentPlayer}</p>
      </div>
    </div>
  );
}

export default App;
