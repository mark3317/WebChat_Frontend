export function initializeChatListLogic() {
  // MAINCHAT.HTML ПРОВЕРКА
  if (window.location.pathname.endsWith("mainchat.html")) {
    document.addEventListener("DOMContentLoaded", (event) => {
      // Функция для создания элемента <li> для каждого чата
      function createChatItem(chatId, chatName) {
        const li = document.createElement("li");
        li.className = "chat-item";
        li.id = `chat_${chatId}`;
        li.textContent = chatName ? chatName : `Chat (ID: ${chatId})`;
        return li;
      }

      // Функция для добавления всех элементов <li> в список <ul>
      function populateChatList(chatIds, chatNames) {
        const chatList = document.getElementById("chat-list");
        chatList.innerHTML = ""; // Очищаем список перед добавлением новых элементов
        chatIds.forEach((chatId, index) => {
          const chatName = chatNames ? chatNames[index] : null;
          const chatItem = createChatItem(chatId, chatName);
          chatList.appendChild(chatItem);
        });

        // Скрываем спиннер после добавления элементов
        document.getElementById("spinner2").style.display = "none";
      }

      // Функция для проверки и обновления списка чатов
      function checkAndUpdateChatList() {
        const allChatIds = JSON.parse(sessionStorage.getItem("allChatIds"));
        const allChatNames = JSON.parse(sessionStorage.getItem("allChatNames"));
        if (allChatIds && allChatIds.length > 0) {
          populateChatList(allChatIds, allChatNames);
        }
      }

      // Обработчик события для обновления списка чатов
      window.addEventListener("updateChatList", checkAndUpdateChatList);

      // Инициализируем список чатов при загрузке страницы
      checkAndUpdateChatList();

      // Функция для ожидания появления данных в SessionStorage
      function waitForChatData() {
        const allChatIds = JSON.parse(sessionStorage.getItem("allChatIds"));
        const allChatNames = JSON.parse(sessionStorage.getItem("allChatNames"));
        if (
          allChatIds &&
          allChatIds.length > 0 &&
          allChatNames &&
          allChatNames.length > 0
        ) {
          updateChatData(allChatIds, allChatNames);
        } else {
          console.warn(
            "Нет данных о чатах в SessionStorage, повторная проверка через 500 мс"
          );
          setTimeout(waitForChatData, 500); // Повторная проверка через 500 мс
        }
      }

      // Автоматическое обновление данных о чатах при загрузке страницы
      waitForChatData();
    });

    // Функция для обновления данных о чатах и вызова события
    function updateChatData(newChatIds, newChatNames) {
      sessionStorage.setItem("allChatIds", JSON.stringify(newChatIds));
      sessionStorage.setItem("allChatNames", JSON.stringify(newChatNames));
      const event = new Event("updateChatList");
      window.dispatchEvent(event);
    }

    // Очищаем sessionStorage при выходе со страницы
    window.addEventListener("beforeunload", (event) => {
      sessionStorage.clear();
    });
  }
}
