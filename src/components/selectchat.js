// Функция для проверки наличия ключа "CurrentChatId" и изменения стиля элемента
function updateSendContainerVisibility() {
  const sendContainer = document.getElementById("sendContainer");

  if (sessionStorage.getItem("CurrentChatId")) {
    sendContainer.style.display = "grid"; // Элемент видим
  } else {
    sendContainer.style.display = "none"; // Элемент скрыт
  }
}

// Функция для проверки наличия ключа "CurrentChatId" и изменения стиля элемента button
function updateCloseContainerVisibility() {
  const closeContainer = document.getElementById("close_container");

  if (sessionStorage.getItem("CurrentChatId")) {
    closeContainer.style.display = "block"; // Элемент видим
  } else {
    closeContainer.style.display = "none"; // Элемент скрыт
  }
}

// Инициализация наблюдателя за изменениями в sessionStorage
function observeSessionStorage() {
  const originalSetItem = sessionStorage.setItem;
  const originalRemoveItem = sessionStorage.removeItem;

  // Переопределяем методы setItem и removeItem для отслеживания изменений
  sessionStorage.setItem = function (key, value) {
    originalSetItem.apply(this, arguments);
    if (key === "CurrentChatId") {
      updateSendContainerVisibility();
      updateCloseContainerVisibility();
    }
  };

  sessionStorage.removeItem = function (key) {
    originalRemoveItem.apply(this, arguments);
    if (key === "CurrentChatId") {
      updateSendContainerVisibility();
      updateCloseContainerVisibility();
    }
  };

  // Первоначальная проверка при загрузке страницы
  updateSendContainerVisibility();
  updateCloseContainerVisibility();
}

// Функция для обработки нажатия на кнопку close_container
function handleCloseContainerClick() {
  // Удаляем ключ CurrentChatId из sessionStorage
  sessionStorage.removeItem("CurrentChatId");

  // Очищаем все сообщения в div с id "message_container"
  const messageContainer = document.getElementById("message_container");
  while (messageContainer.firstChild) {
    messageContainer.removeChild(messageContainer.firstChild);
  }

  // Устанавливаем текст "Выберите чат" для элемента h1 с id "NameOfChat"
  const nameOfChat = document.getElementById("NameOfChat");
  nameOfChat.textContent = "Выберите чат";

  // Устанавливаем display:none для элемента с id "sendContainer"
  const sendContainer = document.getElementById("sendContainer");
  sendContainer.style.display = "none";
}

// Добавляем обработчик события для кнопки close_container
document
  .getElementById("close_container")
  .addEventListener("click", handleCloseContainerClick);

// Запуск наблюдателя
observeSessionStorage();
