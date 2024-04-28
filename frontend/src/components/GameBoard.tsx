import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userIdState } from "../store/user";

export default function GameBoard() {
  const gameId = useParams();
  const [board, setBoard] = useState<string[][]>([
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"],
  ]);
  const [winner, setWinner] = useState("");
  const [turn, setTurn] = useState("");
  const player = useRecoilValue(userIdState);
  const socket = useSocket();
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "game_over") {
          setWinner(data.winner);
        } else if (data.type === "move_made") {
          const { row, col, symbol } = data;
          setBoard((prevBoard) => {
            const newBoard = [...prevBoard];
            newBoard[row][col] = symbol;
            return newBoard;
          });
          setTurn(symbol === "X" ? "O" : "X");
        } else if (data.type === "board") {
          setBoard(data.board);
        }
      };
    }
  }, [socket]);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (socket) {
      if (board[rowIndex][colIndex] === "-") {
        const newBoard = [...board];
        newBoard[rowIndex][colIndex] = currentPlayer;
        setBoard(newBoard);
        socket.send(
          JSON.stringify({
            type: "move",
            player,
            move: {
              row: rowIndex,
              col: colIndex,
            },
            symbol: currentPlayer,
            gameId: gameId,
          })
        );

        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      } else {
        console.error("Cell is already occupied");
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
      {winner ? <h2>Winner: {winner}</h2> : <h2>Turn: {turn}</h2>}
      <div className="board">
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
    </div>
  );
}
