import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient;

export function initializeWebSocket() {
  const socket = new SockJS("http://94.242.53.252:8081/api/ws");
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log(str),
  });

  stompClient.onConnect = async (frame) => {
    console.log("Connected to WebSocket:", frame);

    // Подписка на чат после успешного подключения
    stompClient.subscribe(`/topic/chat/${chatId}`, (message) => {
      console.log("Received raw message:", message);

      try {
        const messageBody = JSON.parse(message.body);
        console.log("Parsed message body:", messageBody);
      } catch (error) {
        console.error("Error parsing message body:", error);
      }
    });
  };

  stompClient.onStompError = (frame) => {
    console.error("Broker reported error: " + frame.headers["message"]);
    console.error("Additional details: " + frame.body);
  };

  socket.onclose = (event) => {
    console.error("WebSocket closed:", event);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  stompClient.activate();
  console.log("STOMP client activated");
}

//todo  SEND MESSAGE FUNCTION
export function sendMessage(content) {
  const stompClient = getStompClient();
  if (!stompClient || !stompClient.connected) {
    console.error("STOMP client is not connected");
    return;
  }

  const chatId = parseInt(sessionStorage.getItem("CurrentChatId"), 10);
  if (isNaN(chatId)) {
    console.error("Invalid chatId in sessionStorage");
    return;
  }

  const userId = parseInt(localStorage.getItem("userId"), 10);
  if (isNaN(userId)) {
    console.error("Invalid userId in localStorage");
    return;
  }

  const message = { chatId, senderId: userId, content };
  console.log("Sending message:", message);
  stompClient.publish({
    destination: "/app/message",
    body: JSON.stringify(message),
  });
  console.log(`Message sent to chat ${chatId}: ${content}`);
}

export function getStompClient() {
  return stompClient;
}
