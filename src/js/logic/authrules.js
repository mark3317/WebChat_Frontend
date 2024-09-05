import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { jwtDecode } from "jwt-decode";

// Проверка наличия элемента, уникального для index.html
const loginForm = document.querySelector(".authorize-form");

if (loginForm) {
  // Функция для выполнения входа
  const loginForm = document.querySelector(".authorize-form");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const login = document.getElementById("login").value;
    const password = document.getElementById("password").value;

    // Проверка на валидность
    if (!login) {
      alert("Логин не может быть пустым");
      return;
    }
    if (!password) {
      alert("Пароль не может быть пустым");
      return;
    }

    try {
      const response = await fetch("http://94.242.53.252:8081/api/signIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      if (response.ok) {
        const token = await response.text();
        console.log("Login successful:", token);
        localStorage.setItem("token", token);

        if (token) {
          const decodedToken = jwtDecode(token);
          const username = decodedToken.sub; // Извлечение subject (username)
          console.log("Username from token:", username);
          // Дополнительные действия после успешного входа
          connectWebsocket(username);
        } else {
          console.log("Token not found");
        }
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  });

  function connectWebsocket(username) {
    const socket = new SockJS("http://94.242.53.252:8081/api/ws");
    const stompClient = Stomp.over(socket);
    //todo STOMP CLIENT

    stompClient.onConnect = (frame) => {
      console.log("Connected: " + frame);

      // Пример id для тестового прогона (нужно будет достать из запроса на /profile)
      const userId = username === "admin" ? 1 : 2;
      // Примеры id чатов для тестового прогона (нужно будет достать из запроса на /profile)
      const chatsId = [1, 2];

      // Подписка на приглашения юзера
      stompClient.subscribe(`/user/${userId}/invite`, (message) => {
        const response = JSON.parse(message.body);
        alert(response.content);
      });

      // Подписка на сообщения чата (должно быть столько же сколько и чатов у юзера)
      chatsId.forEach((chatId) => {
        stompClient.subscribe(`/chat/${chatId}/message`, (message) => {
          const response = JSON.parse(message.body);
          alert(response.content);
        });
      });

      // Пример отправки сообщения от админа
      if (username === "admin") {
        const message = {
          chatId: 2,
          senderId: 1,
          content: "Hello",
        };
        stompClient.send("/app/message", {}, JSON.stringify(message));
      }
      // Сохранение состояния Stomp клиента в localStorage
      localStorage.setItem("stompClientConnected", true);
      localStorage.setItem("userId", userId);
      localStorage.setItem("chatsId", JSON.stringify(chatsId));
      // Перенаправление на страницу mainchat.html
      window.location.href = "../../src/html/mainchat.html";
    };

    // Активация stompClient
    stompClient.activate();
  }
}
