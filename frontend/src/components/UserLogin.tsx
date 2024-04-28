import { useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userIdState } from "../store/user";

export default function UserLogin() {
  const socket = useSocket();
  const navigate = useNavigate();
  const userId = crypto.randomUUID();
  const setUserId = useSetRecoilState(userIdState);
  setUserId(userId);
  const startGame = () => {
    if (socket) {
      socket.send(
        JSON.stringify({
          type: "init_game",
          userId,
        })
      );
    }
  };
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);
        if (data.type === "game_started") {
          navigate(`/game/${data.payload.roomId}`);
        }
      };
    }
  }, [socket]);
  return (
    <>
      <button onClick={startGame}>Start The Game</button>
    </>
  );
}
