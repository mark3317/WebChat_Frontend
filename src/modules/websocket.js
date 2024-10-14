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

    // Подписка на тему после успешного подключения
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

function saveSessionMessage(chatId, senderId, content) {
  console.log("Saving message to session storage:", {
    chatId,
    senderId,
    content,
  });
  const sessionKey = `chat_${chatId}`;
  const sessionData = JSON.parse(sessionStorage.getItem(sessionKey)) || {
    id: chatId,
    name: `Chat ${chatId}`,
    messages: [],
    userIds: [],
  };

  const newMessage = {
    senderId,
    content,
    timestamp: new Date().toISOString(),
  };

  sessionData.messages.push(newMessage);

  if (!sessionData.userIds.includes(senderId)) {
    sessionData.userIds.push(senderId);
  }

  sessionStorage.setItem(sessionKey, JSON.stringify(sessionData));
  console.log("Session message saved to sessionStorage");
}

function displayMessage(message) {
  const messageContainer = document.getElementById("message_container");
  if (messageContainer) {
    const messageElement = createMessageElement(message);
    messageContainer.innerHTML += messageElement;
  }
}

export function getStompClient() {
  return stompClient;
}

function createMessageElement(message) {
  const userId = localStorage.getItem("userId");

  const senderId = String(message.senderId);
  const currentUserId = String(userId);
  const senderNickname = getSenderNickname(senderId);

  if (senderId === currentUserId) {
    return `
      <aside class="InputMessageContainer">
        <div class="message-header" id="input_messageHeader">
          <p class="small mb-1 lazure">${senderNickname}</p>
        </div>
        <div class="message-body justify-content-end">
          <div>
            <p class="message-content bg-warning text-white" id="input_message">
              ${message.content}
            </p>
          </div>
          <img
            src="http://94.242.53.252/profile.png"
            alt="avatar 1"
            class="avatar"
          />
        </div>
      </aside>
    `;
  } else {
    return `
      <aside class="OutputMessageContainer">
        <div class="message-header" id="output_messageHeader">
          <p class="small mb-1 lazure">${senderNickname}</p>
        </div>
        <div class="message-body">
          <img
            src="http://94.242.53.252/profile.png"
            alt="avatar 1"
            class="avatar"
          />
          <div>
            <p class="message-content output text-white" id="output_message">
              ${message.content}
            </p>
          </div>
        </div>
      </aside>
    `;
  }
}

function getSenderNickname(senderId) {
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = sessionStorage.getItem(key);
    if (value) {
      try {
        const user = JSON.parse(value);
        if (String(user.id) === String(senderId)) {
          return key; // Возвращаем ключ как senderNickname
        }
      } catch (e) {
        console.error(`Ошибка парсинга JSON для ключа ${key}:`, e);
      }
    }
  }
  return senderId; // Если не найдено, возвращаем senderId
}
