import { getStompClient } from "./websocket";

//* Отправка сообщения в чат
export function sendMessage(chatId, senderId, content) {
  const stompClient = getStompClient();
  if (!stompClient || !stompClient.connected) {
    console.error("STOMP client is not connected");
    return;
  }
  const message = { chatId, senderId, content };
  stompClient.publish({
    destination: "/app/message",
    body: JSON.stringify(message),
  });
  console.log(`Message sent to chat ${chatId}: ${content}`);
}

//* Обработка входящих сообщений, добавляя их в список сообщений чата
export function handleIncomingMessage(message) {
  const { chatId, senderId, content } = JSON.parse(message.body);
  console.log(
    `Received message in chat ${chatId} from sender ${senderId}: ${content}`
  );

  const chatUsers = JSON.parse(sessionStorage.getItem(`chat_${chatId}_users`));
  if (!chatUsers) {
    console.error("Не удалось получить данные из Session Storage");
    return;
  }

  const user = chatUsers.find((user) => user.id === senderId);
  if (!user) {
    console.error("Пользователь с таким senderId не найден в chatUsers");
    return;
  }

  const liElement = document.createElement("li");
  liElement.className = "sms-item_text";
  liElement.innerHTML = `
    <svg
      id="icon_user"
      style="color: darkblue"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="16"
      fill="currentColor"
      class="bi bi-person-fill"
      viewBox="0 0 16 16"
    >
      <path
        d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"
      />
    </svg>
    <span id="sms-username">${user.username}</span><span>:&nbsp</span>
    <span id="sms-message">${content}</span>
  `;

  const chatList = document.getElementById("sms-list");
  if (chatList) {
    chatList.appendChild(liElement);
  } else {
    console.error("Не удалось найти элемент с id 'sms-list'");
  }
}
