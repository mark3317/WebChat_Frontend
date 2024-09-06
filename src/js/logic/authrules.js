import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { jwtDecode } from "jwt-decode";
import { setGlobalCursorWait, resetGlobalCursor } from "./cursorlogic";

const loginForm = document.querySelector(".authorize-form");
if (loginForm) {
  // Функция для выполнения входа
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const login = document.getElementById("login").value;
    const password = document.getElementById("password").value;

    const spinner = document.getElementById("spinner");
    spinner.style.display = "block"; //! Отображение спиннера
    setGlobalCursorWait();

    // Проверка на валидность
    const butNormal = document.getElementById("but_normal");
    const butWarning = document.getElementById("but_warning");
    const butFail = document.getElementById("but_fail");

    if (!login) {
      butNormal.style.display = "none";
      butWarning.style.display = "block";

      setTimeout(() => {
        butNormal.style.display = "block";
        butWarning.style.display = "none";
      }, 2000); // 2 секунды

      spinner.style.display = "none"; // !Скрытие спиннера
      resetGlobalCursor();
      return;
    }
    if (!password) {
      butNormal.style.display = "none";
      butWarning.style.display = "block";

      setTimeout(() => {
        butNormal.style.display = "block";
        butWarning.style.display = "none";
      }, 2000); // 2 секунды

      spinner.style.display = "none"; // !Скрытие спиннера
      resetGlobalCursor();
      return;
    }
    //todo ОТПРАВКА ЗАПРОСА НА СЕРВЕР
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
          spinner.style.display = "none"; // !Скрытие спиннера
          resetGlobalCursor();
        }
      } else {
        console.log("Login failed");
        spinner.style.display = "none"; // !Скрытие спиннера
        resetGlobalCursor();
        //* Показать/скрыть кнопки
        butNormal.style.display = "none";
        butFail.style.display = "block";

        setTimeout(() => {
          butNormal.style.display = "block";
          butFail.style.display = "none";
        }, 2000); // 2 секунды
      }
    } catch (error) {
      console.error("Error during login:", error);
      spinner.style.display = "none"; // !Скрытие спиннера
      resetGlobalCursor();
    }
  });

  function connectWebsocket(username) {
    const socket = new SockJS("http://94.242.53.252:8081/api/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log(str);
      },
    });

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
        spinner.style.display = "none"; // !Скрытие спиннера
        resetGlobalCursor();
      });

      // Подписка на сообщения чата (должно быть столько же сколько и чатов у юзера)
      chatsId.forEach((chatId) => {
        stompClient.subscribe(`/chat/${chatId}/message`, (message) => {
          const response = JSON.parse(message.body);
          alert(response.content);
          spinner.style.display = "none"; // !Скрытие спиннера
          resetGlobalCursor();
        });
      });

      // Пример отправки сообщения от админа
      if (username === "admin") {
        const message = {
          chatId: 2,
          senderId: 1,
          content: "Hello",
        };
        stompClient.publish({
          destination: "/app/message",
          body: JSON.stringify(message),
        });
      }
      // Сохранение состояния Stomp клиента в localStorage
      localStorage.setItem("stompClientConnected", true);
      localStorage.setItem("userId", userId);
      localStorage.setItem("chatsId", JSON.stringify(chatsId));
      spinner.style.display = "none"; // !Скрытие спиннера
      resetGlobalCursor();

      // Перенаправление на страницу mainchat.html
      window.location.href = "../../src/html/mainchat.html";
    };

    // Активация stompClient
    stompClient.activate();
  }
}
