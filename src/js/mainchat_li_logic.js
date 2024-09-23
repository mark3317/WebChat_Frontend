document.addEventListener("DOMContentLoaded", (event) => {
  // Функция для создания элемента <li> для каждого чата
  function createChatItem(chatId) {
    // Создаем элемент <li>
    const li = document.createElement("li");
    li.className = "chat-item";
    li.textContent = `Chat (ID: ${chatId})`;
    return li;
  }

  // Функция для добавления всех элементов <li> в список <ul>
  function populateChatList(chatIds) {
    const chatList = document.getElementById("chat-list");
    chatList.innerHTML = ""; // Очищаем список перед добавлением новых элементов
    chatIds.forEach((chatId) => {
      const chatItem = createChatItem(chatId);
      chatList.appendChild(chatItem);
    });

    // Скрываем спиннер после добавления элементов
    document.getElementById("spinner2").style.display = "none";
  }

  // Функция для проверки и обновления списка чатов
  function checkAndUpdateChatList() {
    // Получаем массив allChatIds из sessionStorage
    const allChatIds = JSON.parse(sessionStorage.getItem("allChatIds"));

    // Проверяем, существует ли массив allChatIds и не пуст ли он
    if (allChatIds && allChatIds.length > 0) {
      // Заполняем список чатов
      populateChatList(allChatIds);
    }
  }

  // Запускаем проверку каждые 500 мс
  setInterval(checkAndUpdateChatList, 500);
});

//! Очищаем sessionStorage при выходе с страницы
window.addEventListener("beforeunload", (event) => {
  sessionStorage.clear();
});
