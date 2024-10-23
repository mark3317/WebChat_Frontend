// Слушаем пользовательское событие "newChatMessage"
window.addEventListener("newChatMessage", (event) => {
  const { chatId, senderId, content } = event.detail;
  console.log("Получено новое сообщение:", chatId, senderId, content);

  // Проверяем, соответствует ли chatId значению currentChatId в sessionStorage
  const currentChatId = sessionStorage.getItem("CurrentChatId");
  if (currentChatId === null) {
    console.error("CurrentChatId не найден в sessionStorage");
    return;
  }

  if (String(chatId) === String(currentChatId)) {
    console.log(
      "chatId соответствует currentChatId, вызываем createMessageElement"
    );
    createMessageElement({ chatId, senderId, content });
  } else {
    console.log(
      "chatId не соответствует currentChatId, сообщение не будет отображено"
    );
  }
});

function getSenderNickname2(senderId) {
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = sessionStorage.getItem(key);
    if (value) {
      try {
        const user = JSON.parse(value);
        if (String(user.id) === String(senderId)) {
          return key; // Возвращаем ключ как senderNickname
        }
      } catch (e) {
        console.error(`Ошибка парсинга JSON для ключа ${key}:`, e);
      }
    }
  }
  return senderId; // Если не найдено, возвращаем senderId
}

function createMessageElement(message) {
  const userId = localStorage.getItem("userId");

  // Приведение к строке для корректного сравнения
  const senderId = String(message.senderId);
  const currentUserId = String(userId);
  const senderNickname = getSenderNickname2(senderId);

  // Получаем контейнер для сообщений
  const messageContainer = document.getElementById("message_container");

  //! Шаблон сообщений
  if (senderId === currentUserId) {
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
