import { loadChatMessages } from "./htmlrender/grid_container.js";
import { initializeIndexedDB } from "../indexedDB.js";
export function initializeChatLogic() {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM полностью загружен и обработан");

    // Функция для добавления обработчиков событий к элементам <li>
    function addEventListenersToChatItems() {
      document.querySelectorAll("li[id^='chat_']").forEach((item) => {
        if (!item.dataset.listenerAdded) {
          console.log(`Найден элемент: ${item.id}`);

          item.addEventListener("click", (event) => {
            const chatId = event.target.id.split("_")[1];
            console.log(`Клик по элементу с chatId: ${chatId}`);
            showChatContainer(chatId);
          });

          // Отметить, что обработчик добавлен, чтобы избежать дублирования
          item.dataset.listenerAdded = "true";
        }
      });
    }

    // Создать экземпляр MutationObserver
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          addEventListenersToChatItems();
        }
      });
    });

    // Настроить наблюдатель на отслеживание изменений в дочерних элементах
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Добавить обработчики событий к уже существующим элементам
    addEventListenersToChatItems();
  });

  function showChatContainer(chatId) {
    console.log(`Показать контейнер для чата с chatId: ${chatId}`);
    //* Загрузить сообщения из IndexedDB (chats) и отобразить их
    initializeIndexedDB();
    loadChatMessages(chatId);
  }

  //   function closeChatContainer() {
  //     console.log("Закрыть контейнер чата и показать selectChat");

  //     // Показать selectChat
  //     const selectChat = document.getElementById("selectChat");
  //     if (selectChat) {
  //       selectChat.style.display = "block";
  //       console.log("selectChat показан");
  //     } else {
  //       console.error("selectChat не найден");
  //     }

  //     // Скрыть chat_container
  //     const chatContainer = document.getElementById("chat_container");
  //     if (chatContainer) {
  //       chatContainer.style.display = "none";
  //       console.log("chat_container скрыт");

  //       // Удаляем CurrentChatId из sessionStorage
  //       sessionStorage.removeItem("CurrentChatId");
  //       console.log("CurrentChatId удален из sessionStorage");
  //     } else {
  //       console.error("chat_container не найден");
  //     }
  //   }
}
