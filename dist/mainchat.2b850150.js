// Получаем имя пользователя из localStorage
const username = localStorage.getItem("username");
// Обновляем текст "Привет, user" на "Привет, [username]"
document.querySelector("body").innerHTML = document.querySelector("body").innerHTML.replace("\u041F\u0440\u0438\u0432\u0435\u0442, user", `\u{41F}\u{440}\u{438}\u{432}\u{435}\u{442}, ${username}`);

//# sourceMappingURL=mainchat.2b850150.js.map
