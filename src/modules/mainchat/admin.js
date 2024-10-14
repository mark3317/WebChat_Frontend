export async function initializeAdminPanel() {
  document.addEventListener("DOMContentLoaded", async (event) => {
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

    // Обработка нажатия на кнопку для поиска ключей с email в sessionStorage
    const testButton = document.getElementById("test_button");
    if (testButton) {
      testButton.addEventListener("click", async () => {
        console.log("Test button clicked");
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          const value = sessionStorage.getItem(key);
          try {
            // Проверка, является ли значение допустимым JSON
            const parsedValue = JSON.parse(value);
            if (parsedValue && parsedValue.email) {
              appendToConsole(
                `${key}; email: ${parsedValue.email}, Id: ${parsedValue.id}`
              );
            }
          } catch (e) {
            // Если значение не является JSON, пропускаем его
            console.warn(`Skipping non-JSON value (jwt token)`);
          }
        }
      });
    } else {
      console.error("Test button not found");
    }
  });
}
