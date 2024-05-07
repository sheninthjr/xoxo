import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { userIdState } from "../store/user";

export const WS_URL = import.meta.env.VITE_APP_WS_URL ?? "ws://localhost:8080";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const userId = useRecoilValue(userIdState);
  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?userId=${userId}`);
    ws.onopen = () => {
      setSocket(ws);
    };
    ws.onclose = () => {
      setSocket(null);
    };
  }, []);
  return socket;
};
