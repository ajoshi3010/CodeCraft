import { useState, useEffect } from "react";
import randomNumber from "../utils/NumGenerator";


const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const randomUserId = randomNumber();
    const newSocket = new WebSocket(`${import.meta.env.VITE_WEB_SOCKET_URL}?userId=${randomUserId}`);
    newSocket.onopen = () => {
      console.log("WebSocket connection opened");
      setSocket(newSocket);
    };

    newSocket.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
      setSocket(null);
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // newSocket.onmessage = (event) => {
    //   console.log("Message received:", event.data);
    // };

    return () => {
      newSocket.close();
    };
  }, []);

  return socket;
};

export default useWebSocket;
