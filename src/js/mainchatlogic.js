import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

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

    // Функция для отправки сообщения в чат
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

      // Получаем userId из localStorage
      const userId = localStorage.getItem("userId");
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
            // Проходим по всем чатам и подписываемся на каждый
            chats.forEach((chat) => {
              const chatId = chat.id;
              console.log("Extracted chatId from profile:", chatId);

              // Подписываемся на сообщения в чате с использованием chatId
              stompClient.subscribe(`/chat/${chatId}/message`, (message) => {
                // Получаю ChatMessageDto из сообщения
                const chatMessage = JSON.parse(message.body);
                console.log(
                  `Received message in chat ${chatId}: ${chatMessage.content}`
                );
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
      if (username === "admin") {
        console.log("User is admin, sending welcome message...");
        const message = { chatId: 1, senderId: 1, content: "Hello" };
        console.log("Sending message:", message);
        stompClient.publish({
          destination: "/app/message",
          body: JSON.stringify(message),
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
          `http://94.242.53.252:8081/api/users?nickname=${nickname}`,
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
