import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

// Проверяем, находится ли текущая страница на mainchat.html
if (window.location.pathname.includes("mainchat.html")) {
  // Функция для подключения к WebSocket
  function connectWebsocket(username) {
    // Создаем новый SockJS объект для подключения к WebSocket серверу
    const socket = new SockJS("http://94.242.53.252:8081/api/ws");
    // Создаем новый STOMP клиент
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
    });
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Обработчик события подключения
    stompClient.onConnect = (frame) => {
      console.log("Connected: " + frame);

      // Получаем userId из localStorage
      const userId = localStorage.getItem("userId");
      // Массив с идентификаторами чатов
      const chatsId = [1];

      // Подписываемся на приглашения для пользователя
      stompClient.subscribe(`/user/${userId}/invite`, (message) => {
        // Получаю ChatDto из сообщения
        const response = JSON.parse(message.body);
        console.log(response.content);
      });

      // Подписываемся на сообщения в каждом чате
      chatsId.forEach((chatId) => {
        stompClient.subscribe(`/chat/${chatId}/message`, (message) => {
          const response = JSON.parse(message.body);
          console.log(response.content);
        });
      });

      // Если пользователь - администратор, отправляем приветственное сообщение
      if (username === "admin") {
        const message = { chatId: 1, senderId: 1, content: "Hello" };
        stompClient.publish({
          destination: "/app/message",
          body: JSON.stringify(message),
        });
      }
    };
    // Обработка ошибок STOMP
    stompClient.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };
    // STOMP Активация клиента
    stompClient.activate();
  }
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // Получаем имя пользователя из localStorage
  const username = localStorage.getItem("username");
  if (username) {
    connectWebsocket(username);
  }

  // Функция для отправки GET запроса и обработки ответа
  async function findUsers(event) {
    // Отмена действия по умолчанию (предотвращение обновления страницы)
    event.preventDefault();

    // Извлечение токена из localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token not found in localStorage");
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
      // Отправка GET запроса на сервер
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

        // Обновление содержимого элемента ul.search-results
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
        console.error("Failed to fetch users:", response.statusText);
      }
    } catch (error) {
      console.error("Error during fetching users:", error);
    }
  }

  // Добавление обработчика события для кнопки с id "finduser"
  document.getElementById("finduser").addEventListener("click", findUsers);
}
