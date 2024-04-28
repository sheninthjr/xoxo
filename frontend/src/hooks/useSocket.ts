import { useEffect, useState } from "react";

const WS_URL = import.meta.env.VITE_APP_WS_URL ?? "ws://localhost:8080";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const ws = new WebSocket(`${WS_URL}`);
  useEffect(() => {
    ws.onopen = () => {
      setSocket(ws);
    };
    ws.onclose = () => {
      setSocket(null);
    };
  }, []);
  return socket;
};
