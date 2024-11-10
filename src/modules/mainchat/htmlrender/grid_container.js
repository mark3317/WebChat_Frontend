export const chatContainerHTML = () => /*html*/ `
  <section class="chat_container">
    <header class="chat_header">
      <div class="chat_header_info" style="display: flex">
        <h1 id="NameOfChat">Выберите чат</h1>
        <button
          type="button"
          class="btn-close btn-close-white"
          id="close_container"
          aria-label="Close"
        ></button>
      </div>
    </header>
    <main class="chat_main">
      <!--* Тело карточки -->
      <div class="card-body custom-scrollbar" id="message_container">
        <!-- Сообщения будут отображаться здесь -->
      </div>
    </main>
    <footer class="chat_footer">
      <!--* GRID MessageSend Container -->
      <aside class="grid_message_send_container" id="sendContainer">
        <div class="grid_sms_input">
          <input
            type="text"
            id="sms-input"
            class="form-control"
            placeholder="Введите сообщение..."
            aria-label="Введите сообщение..."
            aria-describedby="button-addon2"
          />
        </div>
        <div class="grid_sms_button">
          <button type="submit" class="btn btn-success" id="send_message">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-send-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.3L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"
              ></path>
            </svg>
          </button>
        </div>
  </aside>
  </footer>
`;

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function displayMessages(container, messages) {
  // Очистить контейнер перед добавлением новых сообщений
  container.innerHTML = "";

  messages.forEach((message) => {
    const messageElement = createMessageElement(message);
    container.innerHTML += messageElement;
  });

  console.log("Сообщения успешно загружены и отображены");
}
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export function loadChatMessages(chatId) {
  console.log(`Загрузка сообщений для чата с chatId: ${chatId}`);

  // Сохраняем chatId в sessionStorage
  sessionStorage.setItem("CurrentChatId", chatId);

  //* Открытие базы данных
  const dbRequest = indexedDB.open("ChatDatabase", 1);

  dbRequest.onerror = (event) => {
    console.error("Ошибка открытия базы данных", event);
  };

  dbRequest.onsuccess = (event) => {
    console.log("База данных успешно открыта");

    const db = event.target.result;
    const transaction = db.transaction(["chats"], "readonly");
    const objectStore = transaction.objectStore("chats");
    const request = objectStore.get(Number(chatId));

    request.onerror = (event) => {
      console.error("Ошибка получения данных из objectStore", event);
    };

    request.onsuccess = (event) => {
      const chatData = event.target.result;
      if (chatData) {
        console.log("Данные чата получены", chatData);
        displayMessages(
          document.getElementById("message_container"),
          chatData.messages
        );
        updateChatName(chatData.name);
      } else {
        console.warn(`Данные для чата с chatId: ${chatId} не найдены`);
      }
    };
  };
}

function updateChatName(chatName) {
  const chatNameElement = document.getElementById("NameOfChat");
  if (chatNameElement) {
    chatNameElement.textContent = chatName;
  } else {
    console.error("Элемент с id 'NameOfChat' не найден");
  }
}

function getSenderNickname(senderId) {
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
  const senderNickname = getSenderNickname(senderId);

  //! Шаблон сообщений
  if (senderId === currentUserId) {
    return `
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
    return `
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
