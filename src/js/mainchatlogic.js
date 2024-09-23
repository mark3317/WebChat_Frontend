import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { addChatId, getChatIds } from "./modules/chatIds";

let stompClient; // Определяем stompClient в глобальной области видимости

// Проверяем, находится ли текущая страница на mainchat.html
if (window.location.pathname.includes("mainchat.html")) {
  // Получаем имя пользователя из localStorage
  const username = localStorage.getItem("username");
  console.log("Username from localStorage:", username);

  if (username) {
    console.log("Username found:", username);

    // Создаем новый SockJS объект для подключения к WebSocket серверу
    const socket = new SockJS("http://94.242.53.252:8081/api/ws");
    console.log("SockJS object created");

    // Создаем новый STOMP клиент
    stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
    });
    console.log("STOMP client created");

    //? Функция для отправки сообщения в чат
    function sendMessage(chatId, senderId, content) {
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

    // Экспортируем функцию sendMessage в глобальную область видимости
    window.sendMessage = sendMessage;

    //! Обработчик события подключения
    stompClient.onConnect = async (frame) => {
      console.log("Connected to WebSocket:", frame);

      //* Получаем userId из localStorage
      var userId = parseInt(localStorage.getItem("userId"), 10);
      console.log("User ID:", userId);

      // Получаем токен из localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }

      //* Делаем GET запрос по адресу /api/profile
      try {
        const response = await fetch("http://94.242.53.252:8081/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const chats = data.chats;

          if (chats && chats.length > 0) {
            // Проходим по всем чатам и выполняем GET-запросы для получения информации о каждом чате
            const chatInfoPromises = chats.map((chat) => {
              const chatId = chat.id;
              console.log("'Импортирован ChatID из профиля':", chatId);

              // Добавляем chatId в модуль
              addChatId(chatId);

              // Выполняем GET-запрос для получения информации о чате с токеном
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
                  // Сохраняем информацию о чате в SessionStorage
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

            // Ждем завершения всех GET-запросов перед подпиской на чаты
            await Promise.all(chatInfoPromises);

            // Теперь подписываемся на каждый чат
            chats.forEach((chat) => {
              const chatId = chat.id;

              // Подписываемся на сообщения в чате с использованием chatId
              stompClient.subscribe(`/chat/${chatId}/message`, (message) => {
                //! Получаем объекты Users из Session Storage для соответствия id к юзернейму
                const chatUsers = JSON.parse(
                  sessionStorage.getItem("chat_1_users")
                );
                if (!chatUsers) {
                  console.error(
                    "Не удалось получить данные из Session Storage"
                  );
                  return;
                }

                //* Извлекаем из ChatMessageDto данные о сообщении
                const { chatId, senderId, content } = JSON.parse(message.body);
                console.log(
                  `Received message in chat ${chatId} from sender ${senderId}: ${content}`
                );

                // Находим пользователя с id, равным senderId, в chatUsers
                const user = chatUsers.find((user) => user.id === senderId);
                if (!user) {
                  console.error(
                    "Пользователь с таким senderId не найден в chatUsers"
                  );
                  return;
                }

                // Обновляем содержимое элемента <li>
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

                // Интегрируем элемент <li> в HTML файл
                const chatList = document.getElementById("sms-list");
                if (chatList) {
                  chatList.appendChild(liElement);
                } else {
                  console.error("Не удалось найти элемент с id 'sms-list'");
                }
              });

              console.log(`Подписка на сообщения в чате ${chatId} выполнена`);
            });
          } else {
            console.log("В ответе профиля не найдено ни одного чата");
          }
        } else {
          console.error(
            "Не удалось получить данные профиля:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Ошибка при получении данных профиля:", error);
      }

      // Получаем все chatIds с помощью getChatIds
      const allChatIds = getChatIds();
      console.log("Все chatIds:", allChatIds);

      //? Сохраняем все chatIds в sessionStorage
      sessionStorage.setItem("allChatIds", JSON.stringify(allChatIds));

      //!  ЛОГИКА ОТОБРАЖЕНИЯ CHATLIST

      //* Подписываемся на инвайты
      stompClient.subscribe(`/user/${userId}/invite`, (message) => {
        // Получаю ChatDto из сообщения
        const response = JSON.parse(message.body);
        console.log("Инвайт получен:", response);

        // Извлекаем значение id (айди чата) из ответа
        const chatId = response.id;
        console.log("Извлечено chatId из инвайта:", chatId);

        // Подписываемся на сообщения в чате с использованием chatId
        stompClient.subscribe(`/chat/${chatId}/message`, (message) => {
          // Получаю ChatMessageDto из сообщения
          const chatMessage = JSON.parse(message.body);
          console.log(
            `Полученное сообщение в чате ${chatId}: ${chatMessage.content}`
          );
        });
        console.log(`Подписка на сообщения в чате ${chatId} выполнена`);
      });
      console.log("Подписка на получение инвайтов выполнена");

      // Если пользователь - администратор, отправляем приветственное сообщение
      const testButton = document.getElementById("test_button");
      if (testButton) {
        testButton.addEventListener("click", () => {
          if (username === "admin") {
            console.log("User is admin, sending welcome message...");
            const message = { chatId: 1, senderId: 1, content: "Hello" };
            console.log("Sending message:", message);
            stompClient.publish({
              destination: "/app/message",
              body: JSON.stringify(message),
            });
          }
        });
      }
    };

    //* Обработка ошибок STOMP
    stompClient.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };

    // Обработка закрытия WebSocket соединения
    socket.onclose = (event) => {
      console.error("WebSocket closed:", event);
    };

    // Обработка ошибок WebSocket соединения
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Активация STOMP клиента
    stompClient.activate();
    console.log("STOMP client activated");

    //* GET запрос на получение пользователя по никнейму (Работает только у админа)
    async function findUsers(event) {
      // Отмена действия по умолчанию (предотвращение обновления страницы)
      event.preventDefault();

      // Извлечение токена из localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token не найден в localStorage");
        return;
      }

      // Извлечение значения из поля ввода
      const input = document.getElementById("nickname-input");
      const nickname = input.value.trim();

      if (!nickname) {
        console.error("Nickname is empty");
        return;
      }

      try {
        //* Отправка GET запроса на сервер
        const response = await fetch(
          `http://94.242.53.252:8081/api/users?username=${nickname}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          // Обработка успешного ответа
          const data = await response.json();
          const user = data.find((user) => user.username === nickname);

          //* Обновление содержимого элемента ul.search-results
          const searchResults = document.querySelector(".search-results");
          searchResults.innerHTML = ""; // Очистка предыдущих результатов

          if (user) {
            const li = document.createElement("li");
            li.textContent = user.username;
            searchResults.appendChild(li);
          } else {
            const li = document.createElement("li");
            li.textContent = "Пользователь не найден";
            li.style.color = "red";
            li.style.cursor = "not-allowed";
            searchResults.appendChild(li);
          }
        } else {
          console.error(
            "Не удалось получить пользователей:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Ошибка при получении пользователей:", error);
      }
    }

    //? Добавление обработчика события для кнопки с id "finduser"
    document.getElementById("finduser").addEventListener("click", findUsers);
  } else {
    console.error("Имя пользователя не найдено в localStorage");
  }
}
//! Функция отправки сообщения на кнопку в чате
// Получаем элементы по их идентификаторам
const sendButton = document.getElementById("send_message");
const messageInput = document.getElementById("sms-input");

// Определяем chatId и senderId
const chatId = 1;
const userId = parseInt(localStorage.getItem("userId"), 10);
// Добавляем обработчик события click для кнопки
sendButton.addEventListener("click", () => {
  // Считываем данные из input
  const content = messageInput.value.trim();

  // Проверяем, что поле ввода не пустое
  if (content) {
    // Вызываем функцию sendMessage
    sendMessage(chatId, userId, content);

    // Очищаем поле ввода после отправки сообщения
    messageInput.value = "";
  } else {
    console.error("Поле ввода сообщения пустое");
  }
});

// Пример функции sendMessage
function sendMessage(chatId, senderId, content) {
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
