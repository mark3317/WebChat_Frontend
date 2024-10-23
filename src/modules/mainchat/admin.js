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

    //* Функция для добавления сообщения в console-output
    function appendToConsole(message) {
      const div = document.createElement("div");
      div.textContent = message;
      consoleOutput.appendChild(div);
      consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    //* Функция для добавления текста IndexDb в консоль
    function appendToConsole2(text) {
      const consoleElement = document.getElementById("console");
      if (consoleElement) {
        console.log(text);
      }
    }

    // Обработка нажатия на кнопку для localStorage
    document
      .getElementById("loc_stor_but")
      .addEventListener("click", function () {
        console.log("LocalStorage!Button clicked");
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
        console.log("SessionStorage!Button clicked");
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

    //* Обработка нажатия на кнопку indexDb_but
    document
      .getElementById("indexDb_but")
      .addEventListener("click", function () {
        console.log("IndexedDB!Button clicked");

        // Открываем существующую базу данных
        const request = indexedDB.open("ChatDatabase", 1);

        request.onsuccess = function (event) {
          const db = event.target.result;

          // Получение данных из объектного хранилища "chats"
          const txChats = db.transaction("chats", "readonly");
          const storeChats = txChats.objectStore("chats");
          const chatsRequest = storeChats.getAll();

          chatsRequest.onsuccess = function () {
            const chats = chatsRequest.result;
            console.log("Chats retrieved:", chats);

            chats.forEach((chat) => {
              appendToConsole2(
                `Chat ID: ${chat.id}, Name: ${chat.name}, User IDs: ${chat.userIds}`
              );
            });
          };

          chatsRequest.onerror = function (event) {
            console.error("Error retrieving chats:", event.target.error);
          };

          // Получение данных из объектного хранилища "session"
          const txSession = db.transaction("session", "readonly");
          const storeSession = txSession.objectStore("session");
          const sessionsRequest = storeSession.getAll();

          sessionsRequest.onsuccess = function () {
            const sessions = sessionsRequest.result;
            console.log("Sessions retrieved:", sessions);

            sessions.forEach((session) => {
              appendToConsole2(
                `Session Key: ${session.key}, Data: ${session.data}`
              );
            });
          };

          sessionsRequest.onerror = function (event) {
            console.error("Error retrieving sessions:", event.target.error);
          };
        };

        request.onerror = function (event) {
          console.error("Error opening database:", event.target.error);
        };
      });

    //todo ЮЗЕРЫ В ПОДПИСАННЫХ ЧАТАХ
    // Обработка нажатия на кнопку для поиска ключей с email в sessionStorage
    const testButton = document.getElementById("test_button");
    if (testButton) {
      testButton.addEventListener("click", async () => {
        console.log("UserInfo!Button clicked");
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

    //todo TEST MESSAGE LOGIC !!!!!!!!!!!!!!!
    function setCookie(name, value, days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      const expires = "expires=" + date.toUTCString();
      document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    function deleteCookie(name) {
      document.cookie =
        name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    // Обработчик нажатия на кнопку с id=message_button
    document.getElementById("message_button").addEventListener("click", () => {
      const messageContent = prompt("Введите сообщение");
      if (messageContent !== null) {
        setCookie("message_content", messageContent, 1); // Сохраняем куки на 1 день
        console.log("Message content сохранен в куки:", messageContent);

        const messageType = prompt("Введите тип сообщения: input или output");
        if (messageType === "input" || messageType === "output") {
          setCookie("message_type", messageType, 1); // Сохраняем куки на 1 день
          console.log("Message type сохранен в куки:", messageType);

          const confirmSend = confirm("Отправить сообщение?");
          if (confirmSend) {
            createMessageElement(); // Вызов функции createMessageElement
          } else {
            deleteCookie("message_content"); // Удаление куки
            deleteCookie("message_type"); // Удаление куки
            console.log("Message content и message type удалены из куки");
          }
        } else {
          alert("Неправильное значение");
          deleteCookie("message_content");
          deleteCookie("message_type");
          console.log("Куки удалены из за неправильного значения");
        }
      } else {
        console.log("Message content не был введен");
      }
    });

    // Функция для создания элемента сообщения
    function createMessageElement() {
      const messageContent = getCookie("message_content");
      const messageType = getCookie("message_type");

      if (!messageContent || !messageType) {
        console.error("Не удалось получить данные из куки");
        return;
      }

      let senderNickname;
      if (messageType === "input") {
        senderNickname = "InputUser";
      } else if (messageType === "output") {
        senderNickname = "OutputUser";
      } else {
        console.error("Неправильное значение message_type");
        return;
      }

      const message = {
        content: messageContent,
        senderId: messageType === "input" ? "InputUser" : "OutputUser",
      };

      // Приведение к строке для корректного сравнения
      const senderId = message.senderId;

      // Шаблон сообщений
      const messageContainer = document.getElementById("message_container");
      if (senderId === "InputUser") {
        messageContainer.innerHTML += `
          <!-- Исходящее сообщение от себя -->
          <aside class="InputMessageContainer">
            <div class="message-header" id="input_messageHeader">
              <p class="small mb-1 lazure">${senderNickname}</p>
            </div>
            <div class="message-body justify-content-end">
              <div>
                <p class="message-content bg-warning text-white" id="input_message">
                  ${message.content}
                </p>
              </div>
              <img
                src="http://94.242.53.252/profile.png"
                alt="avatar 1"
                class="avatar"
              />
            </div>
          </aside>
        `;
      } else {
        messageContainer.innerHTML += `
          <!-- Входящее сообщение от пользователя -->
          <aside class="OutputMessageContainer">
            <div class="message-header" id="output_messageHeader">
              <p class="small mb-1 lazure">${senderNickname}</p>
            </div>
            <div class="message-body">
              <img
                src="http://94.242.53.252/profile.png"
                alt="avatar 1"
                class="avatar"
              />
              <div>
                <p class="message-content output text-white" id="output_message">
                  ${message.content}
                </p>
              </div>
            </div>
          </aside>
        `;
      }
    }

    // Функция для получения значения куки
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    }
  });
}
// const testButton2 = document.getElementById("message_button");
// if (testButton2) {
//   testButton2.addEventListener("click", async () => {
//     console.log("MessageInfo!Button clicked");
//   });
// }
