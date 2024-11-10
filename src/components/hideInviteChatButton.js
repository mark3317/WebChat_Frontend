$(document).ready(function () {
  // Функция для обновления состояния кнопки inviteChatButton
  function updateInviteChatButtonState() {
    const inviteChatButton = $("#inviteChatButton");
    if (!sessionStorage.getItem("CurrentChatId")) {
      inviteChatButton.css({
        "background-color": "#6c757d", // Серый цвет для неактивной кнопки
        cursor: "not-allowed", // Неактивный курсор
        "pointer-events": "none", // Отключение всех событий
        opacity: "0.7", // Полупрозрачность
      });
    } else {
      inviteChatButton.css({
        "background-color": "", // Восстановление исходного цвета
        cursor: "", // Восстановление исходного курсора
        "pointer-events": "", // Включение всех событий
        opacity: "", // Восстановление исходной прозрачности
      });
    }
  }

  // Переопределение методов setItem и removeItem для отслеживания изменений в sessionStorage
  const originalSetItem = sessionStorage.setItem;
  sessionStorage.setItem = function (key, value) {
    originalSetItem.apply(this, arguments);
    if (key === "CurrentChatId") {
      updateInviteChatButtonState();
    }
  };

  const originalRemoveItem = sessionStorage.removeItem;
  sessionStorage.removeItem = function (key) {
    originalRemoveItem.apply(this, arguments);
    if (key === "CurrentChatId") {
      updateInviteChatButtonState();
    }
  };

  // Первоначальная проверка при загрузке страницы
  updateInviteChatButtonState();
});
