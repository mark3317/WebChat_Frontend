import { initializeWebSocket, getStompClient, sendMessage } from "../websocket";
import { fetchUserProfile } from "../users";
import { addChatId, getChatIds } from "../chatIds";

export function initializeMainChatLogic() {
  window.initializeWebSocket = initializeWebSocket;
  window.sendMessage = sendMessage;

  document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("mainchat.html")) {
      const username = localStorage.getItem("username");
      console.log("Username from localStorage:", username);

      if (username) {
        initializeWebSocket();

        const stompClient = getStompClient();
        stompClient.onConnect = async (frame) => {
          console.log("Connected to WebSocket:", frame);

          const userId = parseInt(localStorage.getItem("userId"), 10);
          console.log("User ID:", userId);

          let token = localStorage.getItem("token");
          if (!token) {
            console.warn("Token not found in localStorage");
            return;
          }

          const profileData = await fetchUserProfile(token);
          if (profileData) {
            const chats = profileData.chats;
            if (chats && chats.length > 0) {
              const chatInfoPromises = chats.map((chat) => {
                const chatId = chat.id;
                console.log("'Импортирован ChatID из профиля':", chatId);
                addChatId(chatId);

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
                    data.forEach((user) => {
                      const { username, id, email } = user;
                      if (!sessionStorage.getItem(username)) {
                        sessionStorage.setItem(
                          username,
                          JSON.stringify({ id, email })
                        );
                        console.log(
                          `Информация о пользователе ${username} сохранена в SessionStorage`
                        );
                      } else {
                        console.warn(
                          `Пользователь с никнеймом ${username} уже существует в SessionStorage`
                        );
                      }
                    });
                  })
                  .catch((error) => {
                    console.error(
                      `Ошибка при получении информации о чате ${chatId}:`,
                      error
                    );
                  });
              });

              await Promise.all(chatInfoPromises);

              //!!!!!!!!!!!!!!!!!!!!!!!!

              // *FUNCTION ПОДПИСКА НА СООБЩЕНИЯ ЧАТА И ОТОБРАЖЕНИЯ В КОНСОЛИ
              chats.forEach((chat) => {
                const chatId = chat.id;
                stompClient.subscribe(
                  `/chat/${chatId}/message`,
                  async (message) => {
                    const chatMessage = JSON.parse(message.body);
                    console.log(
                      `Message in chatId ${chatId}: ${chatMessage.content}`
                    );
                    console.log(`senderId: ${chatMessage.senderId}`);

                    try {
                      //todo Диспатчим пользовательское событие с данными сообщения
                      const event = new CustomEvent("newChatMessage", {
                        detail: {
                          chatId: chatId,
                          senderId: chatMessage.senderId,
                          content: chatMessage.content,
                        },
                      });
                      window.dispatchEvent(event);
                    } catch (error) {
                      console.error("Failed to dispatch event:", error);
                    }

                    console.log(
                      `Подписка на сообщения в чате ${chatId} выполнена`
                    );
                  }
                );
              });

              // * Подписываемся на инвайты
              stompClient.subscribe(`/user/${userId}/invite`, (message) => {
                // Получаю ChatDto из сообщения
                const response = JSON.parse(message.body);
                console.log("Инвайт получен:", response);

                // Извлекаем значение id (айди чата) из ответа
                const chatId = response.id;
                console.log("Извлечено chatId из инвайта:", chatId);

                // Отображаем сообщение и перезагружаем страницу
                alert(
                  "Вас пригласили в новый чат, страница будет перезагружена"
                );
                location.reload();
              });
              console.log("Подписка на получение инвайтов выполнена");
            }
          }

          //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          const allChatIds = getChatIds();
          console.log("All chatIds:", allChatIds);
          sessionStorage.setItem("allChatIds", JSON.stringify(allChatIds));

          // Функция для получения имени чата по его ID
          function fetchChatName(chatId) {
            const token = localStorage.getItem("token");
            console.log(`Fetching name for chatId: ${chatId}`);
            return fetch(`http://94.242.53.252:8081/api/chats/${chatId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
              })
              .then((chatDto) => {
                console.log(
                  `Received chat name for chatId ${chatId}: ${chatDto.name}`
                );
                return chatDto.name;
              })
              .catch((error) => {
                console.error(
                  `Ошибка при получении данных для чата ${chatId}:`,
                  error
                );
                if (error) {
                  console.log("Ошибка:", error);
                }
                return null; // Возвращаем null в случае ошибки
              });
          }

          // Получаем имена всех чатов
          Promise.all(allChatIds.map(fetchChatName)).then((allChatNames) => {
            console.log("All ChatNames:", allChatNames);
            sessionStorage.setItem(
              "allChatNames",
              JSON.stringify(allChatNames)
            );

            const request = indexedDB.open("ChatDatabase", 1);

            request.onsuccess = (event) => {
              const db = event.target.result;
              console.log("IndexedDB успешно открыта");

              // Пример транзакции для чтения данных из хранилища "chats"
              const transaction = db.transaction(["chats"], "readonly");
              const chatStore = transaction.objectStore("chats");

              // Здесь можно добавить логику для работы с данными из IndexedDB
            };

            request.onerror = (event) => {
              console.error(
                "Ошибка открытия базы данных:",
                event.target.errorCode
              );
            };
          });

          const sendButton = document.getElementById("send_message");
          const messageInput = document.getElementById("sms-input");

          sendButton.addEventListener("click", () => {
            const content = messageInput.value.trim();
            if (content) {
              sendMessage(content);
              messageInput.value = "";
            } else {
              console.error("Поле ввода сообщения пустое");
            }
          });
        };
      }
    }
  });
}
