$(document).ready(function () {
  //! Событие на кнопку "Создать чат"
  $("#createChatButton").on("click", async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const idUsersToInvite = sessionStorage.getItem("IdUsersToInvite");

    if (!token || !userId || !idUsersToInvite) {
      console.error(
        "Не удалось получить необходимые данные из localStorage или sessionStorage"
      );
      return;
    }

    const chatData = {
      name: "", // Пока что оставляем пустое значение
      userIds: [parseInt(userId), parseInt(idUsersToInvite)],
    };

    try {
      const response = await fetch("http://94.242.53.252:8081/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(chatData),
      });

      if (response.ok) {
        console.log("Чат создан успешно");
      } else {
        console.error("Не удалось создать чат:", response.statusText);
      }
    } catch (error) {
      console.error("Ошибка при создании чата:", error);
    }
  });
  //todo Делегирование событий с использованием jQuery
  $(document).on("click", "#finduser2", function (event) {
    // Предотвращаем перезагрузку страницы
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token не найден в localStorage");
      return;
    }

    // Используем prompt для ввода никнейма
    const nickname = prompt("Введите никнейм для поиска:");
    if (!nickname) {
      console.error("Nickname is empty");
      return;
    }

    findUserByUsername(token, nickname.trim());
  });

  //! Поиск пользователя по никнейму
  async function findUserByUsername(token, nickname) {
    try {
      console.log(`Поиск пользователя с никнеймом: ${nickname}`);
      const response = await fetch(
        `http://94.242.53.252:8081/api/users?username=${nickname}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Запрос выполнен успешно");
        const users = await response.json();
        if (users && users.length > 0) {
          const userId = users[0].id;
          sessionStorage.setItem("IdUsersToInvite", userId);
          console.log(`ID пользователя сохранен в sessionStorage: ${userId}`);
        }
        displayUser(users, nickname);
      } else {
        console.error("Не удалось получить пользователя:", response.statusText);
      }
    } catch (error) {
      console.error("Ошибка при получении пользователя:", error);
    }
  }
  //! Отрисовка найденного пользователя
  function displayUser(users, nickname) {
    const searchResults2 = $("#searchResults2 ul");
    searchResults2.empty();

    const user = users.find((user) => user.username === nickname);
    if (user) {
      console.log("Пользователь найден:", user);
      const li = $(`<li>${user.username}</li>`);
      searchResults2.append(li);

      // Добавляем обработчик события click для элемента li
      li.on("click", function () {
        const selectedUser = $(this).text();
        if ($(this).hasClass("selected")) {
          // Сбрасываем стили и удаляем ключ из sessionStorage
          $(this).removeClass("selected");
          $(this).css({ "font-weight": "", color: "" });
          sessionStorage.removeItem("selectUsersToInvite");
        } else {
          // Применяем стили и добавляем ключ в sessionStorage
          $(this).addClass("selected");
          $(this).css({ "font-weight": "bold", color: "blue" });
          sessionStorage.setItem("selectUsersToInvite", selectedUser);
        }
      });
    } else {
      console.log("Пользователь не найден");
      searchResults2.append(
        '<li style="color: red; cursor: not-allowed;">Пользователь не найден</li>'
      );
    }
  }

  // Функция для обновления текста в div с id selectUsersToInvite
  function updateSelectedUserDisplay() {
    const selectedUser = sessionStorage.getItem("selectUsersToInvite");
    const displayElement = $("#selectUsersToInvite");
    if (selectedUser) {
      displayElement.html(`Выбранный пользователь:<br>${selectedUser}`);
    } else {
      displayElement.text("");
    }
  }

  // Переопределение методов setItem и removeItem для отслеживания изменений в sessionStorage
  const originalSetItem = sessionStorage.setItem;
  sessionStorage.setItem = function (key, value) {
    originalSetItem.apply(this, arguments);
    if (key === "selectUsersToInvite") {
      updateSelectedUserDisplay();
    }
  };

  const originalRemoveItem = sessionStorage.removeItem;
  sessionStorage.removeItem = function (key) {
    originalRemoveItem.apply(this, arguments);
    if (key === "selectUsersToInvite") {
      updateSelectedUserDisplay();
    }
  };

  // Первоначальная проверка при загрузке страницы
  updateSelectedUserDisplay();
});
