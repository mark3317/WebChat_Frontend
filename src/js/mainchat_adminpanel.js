import { sendMessage } from "./modules/messages";
document.addEventListener("DOMContentLoaded", (event) => {
  const consoleOutput = document.getElementById("console-output");

  // Проверяем, что текущая страница - mainchat.html
  if (!window.location.pathname.includes("mainchat.html")) {
    return;
  }

  // Получаем userId из localStorage и преобразуем его в число
  const userId = parseInt(localStorage.getItem("userId"), 10);

  // Проверяем, равен ли userId значению 1
  if (userId === 1) {
    // Получаем элемент кнопки по id
    const adminButton = document.getElementById("admin_button");

    // Изменяем стиль кнопки на display: block
    if (adminButton) {
      adminButton.style.display = "block";
    }
  }

  // Функция для добавления сообщения в console-output
  function appendToConsole(message) {
    const div = document.createElement("div");
    div.textContent = message;
    consoleOutput.appendChild(div);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  }

  // Обработка нажатия на кнопку для localStorage
  document
    .getElementById("loc_stor_but")
    .addEventListener("click", function () {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        appendToConsole(`${key}: ${value}`);
      }
    });

  // Обработка нажатия на кнопку для sessionStorage
  document
    .getElementById("sess_stor_but")
    .addEventListener("click", function () {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        const value = sessionStorage.getItem(key);
        appendToConsole(`${key}: ${value}`);
      }
    });

  // Обработка нажатия на кнопку для очистки console-output
  document.getElementById("clear_but").addEventListener("click", function () {
    consoleOutput.innerHTML = "";
  });

  // Отправка тестового сообщения
  const testButton = document.getElementById("test_button");
  if (testButton) {
    testButton.addEventListener("click", () => {
      const username = localStorage.getItem("username");
      if (username === "admin") {
        console.log("User is admin, sending welcome message...");
        sendMessage(1, 1, "Hello");
      }
    });
  }
});
