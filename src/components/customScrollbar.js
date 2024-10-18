document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".custom-scrollbar");
  let scrollSpeed = 0.1; // Начальная скорость прокрутки, очень медленная
  let scrollDirection = 0;

  // Функция для установки положения скролбара в самый низ
  const scrollToBottom = () => {
    container.scrollTop = container.scrollHeight;
  };

  // Создаем MutationObserver для отслеживания изменений в sessionStorage
  const observer = new MutationObserver(() => {
    const currentChatId = sessionStorage.getItem("CurrentChatId");
    if (currentChatId) {
      scrollToBottom();
    }
  });

  // Настройки для MutationObserver
  const config = { childList: true, subtree: true };

  // Наблюдаем за изменениями в body
  observer.observe(document.body, config);

  // Устанавливаем начальное положение скролбара в самый низ
  scrollToBottom();

  container.addEventListener("wheel", (event) => {
    event.preventDefault();
    const deltaY = event.deltaY;

    // Определяем направление прокрутки
    const newDirection = deltaY > 0 ? 1 : -1;

    if (newDirection === scrollDirection) {
      // Если направление не изменилось, увеличиваем скорость
      scrollSpeed = Math.min(scrollSpeed + 0.05, 1); // Увеличиваем скорость медленнее и не более 1
    } else {
      // Если направление изменилось, сбрасываем скорость
      scrollSpeed = 0.1;
    }

    // Обновляем направление
    scrollDirection = newDirection;

    container.scrollTop += deltaY * scrollSpeed; // Уменьшаем величину прокрутки
  });
});
