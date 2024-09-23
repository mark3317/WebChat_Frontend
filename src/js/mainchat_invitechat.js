import { findUsersByUsername } from "./modules/users";

// Проверяем, что текущая страница - mainchat.html
if (!window.location.pathname.includes("mainchat.html")) {
  return;
}

// Обработчик для поиска юзера по никнейму
document.getElementById("finduser").addEventListener("click", async (event) => {
  event.preventDefault();
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token не найден в localStorage");
    return;
  }

  const input = document.getElementById("nickname-input");
  const nickname = input.value.trim();
  if (!nickname) {
    console.error("Nickname is empty");
    return;
  }

  const users = await findUsersByUsername(token, nickname);
  const searchResults = document.querySelector(".search-results");
  searchResults.innerHTML = "";

  if (users) {
    const user = users.find((user) => user.username === nickname);
    if (user) {
      const li = document.createElement("li");
      li.textContent = user.username;
      searchResults.appendChild(li);
    } else {
      const li = document.createElement("li");
      li.textContent = "Пользователь не найден";
      li.style.color = "red";
      li.style.cursor = "not-allowed";
      searchResults.appendChild(li);
    }
  }
});
