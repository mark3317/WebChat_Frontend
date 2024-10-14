// Массив для хранения chatIds
let chatIds = [];

// Функция для добавления chatId в массив
export function addChatId(chatId) {
  chatIds.push(chatId);
}

// Функция для получения массива chatIds
export function getChatIds() {
  return chatIds;
}
