export function initializeIndexedDB() {
  // MAINCHAT.HTML ПРОВЕРКА
  if (window.location.pathname.endsWith("mainchat.html")) {
    window.addEventListener("pageshow", (event) => {
      console.log("Page loaded: mainchat.html");

      // Удаление базы данных IndexedDB при перезагрузке страницы
      const deleteRequest = indexedDB.deleteDatabase("ChatDatabase");

      deleteRequest.onsuccess = () => {
        console.log("IndexedDB successfully deleted");
        initializeDatabase();
      };

      deleteRequest.onerror = (event) => {
        console.error("Error deleting IndexedDB:", event);
        initializeDatabase(); // Попробуем инициализировать базу данных даже при ошибке удаления
      };

      deleteRequest.onblocked = () => {
        console.warn("Deletion of IndexedDB is blocked");
      };

      function initializeDatabase() {
        // Создание или открытие базы данных IndexedDB
        const request = indexedDB.open("ChatDatabase", 1);
        let db; // Declare db in a higher scope

        request.onupgradeneeded = (event) => {
          db = event.target.result;
          console.log("Upgrading or creating IndexedDB");

          // Создаем Объектное хранилище для чатов (с ключом Id)
          if (!db.objectStoreNames.contains("chats")) {
            const chatStore = db.createObjectStore("chats", { keyPath: "id" });
            // Создаем внутри него индексы (name, messages, userIds)
            chatStore.createIndex("name", "name", { unique: false });
            chatStore.createIndex("messages", "messages", { unique: false });
            chatStore.createIndex("userIds", "userIds", {
              unique: false,
              multiEntry: true,
            });
            console.log("Object store 'chats' created");
          }

          // Проверяем, существует ли уже объектное хранилище "session"
          if (!db.objectStoreNames.contains("session")) {
            // Создаем Объектное хранилище для сессий (с ключом key)
            db.createObjectStore("session", { keyPath: "key" });
            console.log("Object store 'session' created");
          }
        };

        request.onsuccess = (event) => {
          db = event.target.result;
          console.log("IndexedDB successfully opened");

          // Функция для ожидания появления ключа allChatIds в Session Storage
          function waitForChatData() {
            const allChatIds = JSON.parse(sessionStorage.getItem("allChatIds"));
            console.log(
              "Checking for allChatIds in sessionStorage:",
              allChatIds
            );
            if (allChatIds && allChatIds.length > 0) {
              console.log("allChatIds found:", allChatIds);
              fetchChatData(allChatIds);
            } else {
              console.warn(
                "Нет данных о чатах в Session Storage, повторная проверка через 500 мс"
              );
              setTimeout(waitForChatData, 500); // Повторная проверка через 500 мс
            }
          }

          // Функция для выполнения GET-запросов и сохранения данных в IndexedDB
          function fetchChatData(chatIds) {
            const token = localStorage.getItem("token");
            if (!token) {
              console.error("Token not found in localStorage");
              return;
            }
            console.log("Fetching chat data for chatIds:", chatIds);
            chatIds.forEach((chatId) => {
              fetch(`http://94.242.53.252:8081/api/chats/${chatId}`, {
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
                  console.log(`Received data for chatId ${chatId}:`, chatDto);
                  saveChatData(chatDto);
                })
                .catch((error) => {
                  console.error(
                    `Ошибка при получении данных для чата ${chatId}:`,
                    error
                  );
                });
            });
          }

          // Инициализация ожидания данных о чатах
          waitForChatData();
        };

        request.onerror = (event) => {
          console.error("Ошибка открытия базы данных:", event);
        };

        function saveChatData(chatDto) {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction(["chats"], "readwrite");
            const chatStore = transaction.objectStore("chats");

            const chatData = {
              id: chatDto.id,
              name: chatDto.name,
              messages: chatDto.messages,
              userIds: chatDto.userIds,
            };

            const request = chatStore.put(chatData);

            request.onsuccess = () => {
              console.log("Chat data saved to IndexedDB");
              resolve();
            };

            request.onerror = (event) => {
              console.error("Error saving chat data to IndexedDB", event);
              reject(event);
            };
          });
        }
      }
    });
  }
}
