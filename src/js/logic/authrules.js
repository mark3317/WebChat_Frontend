import { jwtDecode } from "jwt-decode";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { setGlobalCursorWait, resetGlobalCursor } from "./cursorlogic";

// Определение функции connectWebsocket для подключения к WebSocket
function connectWebsocket(username) {
  const socket = new SockJS("http://94.242.53.252:8081/api/ws");
  const stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log(str),
  });

  // Обработчик успешного подключения
  stompClient.onConnect = (frame) => {
    console.log("Connected: " + frame);
  };

  // Обработчик ошибок STOMP
  stompClient.onStompError = (frame) => {
    console.error("Broker reported error: " + frame.headers["message"]);
    console.error("Additional details: " + frame.body);
  };
  // Активация STOMP клиента
  stompClient.activate();
}

// Ваш существующий код
const loginForm = document.querySelector(".authorize-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const login = document.getElementById("login").value;
    const password = document.getElementById("password").value;
    const spinner = document.getElementById("spinner");
    const butNormal = document.getElementById("but_normal");
    const butWarning = document.getElementById("but_warning");
    const butWarning3 = document.getElementById("but_warning3");
    const butFail = document.getElementById("but_fail");
    const butSuccess = document.getElementById("but_success");

    let showSpinner = () => {
      spinner.style.display = "block";
      setGlobalCursorWait();
    };

    let hideSpinner = () => {
      spinner.style.display = "none";
      resetGlobalCursor();
    };

    let showSuccess = () => {
      butNormal.style.display = "none";
      butSuccess.style.display = "block";
      setTimeout(() => {
        butNormal.style.display = "block";
        butSuccess.style.display = "none";
      }, 2000);
    };

    let showFail = () => {
      butNormal.style.display = "none";
      butFail.style.display = "block";
      setTimeout(() => {
        butNormal.style.display = "block";
        butFail.style.display = "none";
      }, 2000);
    };

    let showWarning = (button) => {
      butNormal.style.display = "none";
      button.style.display = "block";
      setTimeout(() => {
        butNormal.style.display = "block";
        button.style.display = "none";
      }, 2000);
    };

    showSpinner();

    if (!login) {
      showWarning(butWarning);
      hideSpinner();
      return;
    }

    if (!password) {
      showWarning(butWarning);
      hideSpinner();
      return;
    }

    if (login.includes("@")) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(login)) {
        showWarning(butWarning3);
        hideSpinner();
        return;
      }
    }

    // Отправка запроса на сервер для авторизации
    try {
      const response = await fetch("http://94.242.53.252:8081/api/signIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("token", token);

        if (token) {
          const decodedToken = jwtDecode(token);
          const username = decodedToken.sub;
          localStorage.setItem("username", username);
          connectWebsocket(username);

          // Выполнение GET запроса для получения профиля
          const profileResponse = await fetch(
            "http://94.242.53.252:8081/api/profile",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // Получение и сохранение ID пользователя из профиля
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            const userId = profileData.id;
            localStorage.setItem("userId", userId);
            showSuccess();
            window.location.href = "../../src/html/mainchat.html";
          } else {
            console.error("Failed to fetch profile data");
            showFail();
            hideSpinner();
          }
        } else {
          hideSpinner();
        }
      } else {
        showFail();
        hideSpinner();
      }
    } catch (error) {
      console.error("Error during login:", error);
      hideSpinner();
    }
  });
}
