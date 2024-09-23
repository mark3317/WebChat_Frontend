// Получаем имя пользователя из localStorage
const username = localStorage.getItem("username");
// Обновляем текст "Привет, user" на "Привет, [username]"
document.querySelector("body").innerHTML = document
  .querySelector("body")
  .innerHTML.replace("Привет, user", `Привет, ${username}`);
