import { initializeWebSocket, getStompClient } from "./modules/websocket";
import { sendMessage, handleIncomingMessage } from "./modules/messages";
import { fetchUserProfile } from "./modules/users";
import { addChatId, getChatIds } from "./modules/chatIds";

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("mainchat.html")) {
    // Получение имени пользователя из localStorage
    const username = localStorage.getItem("username");
    console.log("Username from localStorage:", username);

    if (username) {
      initializeWebSocket();

      const stompClient = getStompClient();
      stompClient.onConnect = async (frame) => {
        console.log("Connected to WebSocket:", frame);

        // Получаем UserID из localStorage
        const userId = parseInt(localStorage.getItem("userId"), 10);
        console.log("User ID:", userId);

        // Получаем токен из localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found in localStorage");
          return;
        }

        // Получаем данные пользователя по токену
        const profileData = await fetchUserProfile(token);
        if (profileData) {
          const chats = profileData.chats;
          if (chats && chats.length > 0) {
            // Получаем информацию о подписках на чаты пользователя и импортируем ChatId
            const chatInfoPromises = chats.map((chat) => {
              const chatId = chat.id;
              console.log("'Импортирован ChatID из профиля':", chatId);
              addChatId(chatId);

              // Получаем информацию о всех пользователях в чате
              return fetch(
                `http://94.242.53.252:8081/api/chats/${chatId}/users`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
                .then((response) => response.json())
                .then((data) => {
                  // Сохраняем информацию о пользователях чата в SessionStorage
                  sessionStorage.setItem(
                    `chat_${chatId}_users`,
                    JSON.stringify(data)
                  );
                  console.log(
                    `Информация о пользователях в чате ${chatId} сохранена в SessionStorage`
                  );
                })
                .catch((error) => {
                  console.error(
                    `Ошибка при получении информации о чате ${chatId}:`,
                    error
                  );
                });
            });

            // Ждем завершения всех запросов на получение информации о пользователях
            await Promise.all(chatInfoPromises);

            // Подписываемся на получение сообщений в каждом чате
            chats.forEach((chat) => {
              const chatId = chat.id;
              stompClient.subscribe(
                `/chat/${chatId}/message`,
                handleIncomingMessage
              );
              console.log(`Подписка на сообщения в чате ${chatId} выполнена`);
            });
          } else {
            console.log("В ответе профиля не найдено ни одного чата");
          }
        }
        // Получаем все идентификаторы чатов и сохраняем их в sessionStorage
        const allChatIds = getChatIds();
        console.log("Все chatIds:", allChatIds);
        sessionStorage.setItem("allChatIds", JSON.stringify(allChatIds));

        // Подписываемся на получение инвайтов для пользователя
        stompClient.subscribe(`/user/${userId}/invite`, (message) => {
          const response = JSON.parse(message.body);
          console.log("Инвайт получен:", response);

          const chatId = response.id;
          console.log("Извлечено chatId из инвайта:", chatId);

          // Подписываемся на сообщения для нового чата
          stompClient.subscribe(`/chat/${chatId}/message`, (message) => {
            const chatMessage = JSON.parse(message.body);
            console.log(
              `Полученное сообщение в чате ${chatId}: ${chatMessage.content}`
            );
          });
          console.log(`Подписка на сообщения в чате ${chatId} выполнена`);
        });
        console.log("Подписка на получение инвайтов выполнена");
      };

      // Обработчик для кнопки отправки сообщения
      const sendButton = document.getElementById("send_message");
      const messageInput = document.getElementById("sms-input");
      const chatId = 1;
      const userId = parseInt(localStorage.getItem("userId"), 10);

      sendButton.addEventListener("click", () => {
        const content = messageInput.value.trim();
        if (content) {
          sendMessage(chatId, userId, content);
          messageInput.value = "";
        } else {
          console.error("Поле ввода сообщения пустое");
        }
      });
    }
  }
});
