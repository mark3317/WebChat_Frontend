import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient;

export function initializeWebSocket() {
  // Создаем новый SockJS объект, указывая URL сервера WebSocket
  const socket = new SockJS("http://94.242.53.252:8081/api/ws");
  // Создаем новый STOMP клиент, используя SockJS объект
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log(str),
  });
  // Обработчик события успешного подключения
  stompClient.onConnect = async (frame) => {
    console.log("Connected to WebSocket:", frame);
  };
  // Обработчик ошибок STOMP
  stompClient.onStompError = (frame) => {
    console.error("Broker reported error: " + frame.headers["message"]);
    console.error("Additional details: " + frame.body);
  };
  // Обработчик закрытия WebSocket соединения
  socket.onclose = (event) => {
    console.error("WebSocket closed:", event);
  };
  // Обработчик ошибок WebSocket
  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
  // Активация STOMP
  stompClient.activate();
  console.log("STOMP client activated");
}

export function getStompClient() {
  return stompClient;
}
