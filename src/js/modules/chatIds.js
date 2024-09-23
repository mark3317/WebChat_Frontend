// chatIds.js
let chatIds = [];

export function addChatId(chatId) {
  chatIds.push(chatId);
}

export function getChatIds() {
  return chatIds;
}
