import { setGlobalCursorWait, resetGlobalCursor } from "./cursorlogic";

const registrationForm = document.querySelector(".registration");
if (registrationForm) {
  // Логика для отображения пароля
  document
    .getElementById("showPassword")
    .addEventListener("change", function () {
      var passwordField = document.getElementById("floatingPassword");
      var confirmPasswordField = document.getElementById(
        "floatingConfirmPassword"
      );
      if (this.checked) {
        passwordField.type = "text";
        confirmPasswordField.type = "text";
      } else {
        passwordField.type = "password";
        confirmPasswordField.type = "password";
      }
    });

  //todo lets go!
  registrationForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Предотвращаем стандартное поведение формы

    var usernameField = document.getElementById("floatingNickname");
    var emailField = document.getElementById("floatingInput");
    var passwordField = document.getElementById("floatingPassword");
    var confirmPasswordField = document.getElementById(
      "floatingConfirmPassword"
    );
    var butNormal = document.getElementById("but_normal");
    var butWarning = document.getElementById("but_warning");
    var butWarning2 = document.getElementById("but_warning2");
    var butWarning3 = document.getElementById("but_warning3");
    var butFail = document.getElementById("but_fail");
    var butSuccess = document.getElementById("but_success");

    var username = usernameField.value;
    var email = emailField.value;
    var password = passwordField.value;
    var confirmPassword = confirmPasswordField.value;

    // Проверка на заполненность полей
    if (!username || !email || !password || !confirmPassword) {
      setGlobalCursorWait();
      butNormal.style.display = "none";
      butWarning.style.display = "block";

      setTimeout(() => {
        butNormal.style.display = "block";
        butWarning.style.display = "none";
        resetGlobalCursor();
      }, 2000); // 2 секунды

      return; // Прекращаем выполнение функции
    }

    // Проверка на совпадение паролей
    if (password !== confirmPassword) {
      setGlobalCursorWait();
      butNormal.style.display = "none";
      butWarning2.style.display = "block";

      setTimeout(() => {
        butNormal.style.display = "block";
        butWarning2.style.display = "none";
        resetGlobalCursor();
      }, 2000); // 2 секунды

      return; // Прекращаем выполнение функции
    }

    // Проверка на корректность email
    if (email.includes("@")) {
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        setGlobalCursorWait();
        butNormal.style.display = "none";
        butWarning3.style.display = "block";

        setTimeout(() => {
          butNormal.style.display = "block";
          butWarning3.style.display = "none";
          resetGlobalCursor();
        }, 2000); // 2 секунды

        return; // Прекращаем выполнение функции
      }
    }

    // Отображение спиннера и установка глобального курсора "ожидание"
    setGlobalCursorWait();

    //! Отправка запроса на сервер
    try {
      const response = await fetch("http://94.242.53.252:8081/api/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (response.ok) {
        const token = await response.text();
        console.log("Registration successful:", token);
        localStorage.setItem("token", token);

        butNormal.style.display = "none";
        butSuccess.style.display = "block";

        setTimeout(() => {
          butNormal.style.display = "block";
          butSuccess.style.display = "none";

          // Перенаправление на страницу входа или другую страницу
          window.location.href = "../../src/html/index.html";
        }, 2000); // 2 секунды
      } else if (response.status === 400) {
        console.log("Bad Request");
        butNormal.style.display = "none";
        butFail.style.display = "block";

        setTimeout(() => {
          butNormal.style.display = "block";
          butFail.style.display = "none";
          resetGlobalCursor();
        }, 2000); // 2 секунды
      } else if (response.status === 401) {
        console.log("Unauthorized");
        butNormal.style.display = "none";
        butFail.style.display = "block";

        setTimeout(() => {
          butNormal.style.display = "block";
          butFail.style.display = "none";
          resetGlobalCursor();
        }, 2000); // 2 секунды
      } else if (response.status === 404) {
        console.log("Not Found");
        butNormal.style.display = "none";
        butFail.style.display = "block";

        setTimeout(() => {
          butNormal.style.display = "block";
          butFail.style.display = "none";
          resetGlobalCursor();
        }, 2000); // 2 секунды
      } else {
        console.log("Registration failed");
        butNormal.style.display = "none";
        butFail.style.display = "block";

        setTimeout(() => {
          butNormal.style.display = "block";
          butFail.style.display = "none";
          resetGlobalCursor();
        }, 2000); // 2 секунды
      }
    } catch (error) {
      console.error("Error during registration:", error);
      butNormal.style.display = "none";
      butFail.style.display = "block";

      setTimeout(() => {
        butNormal.style.display = "block";
        butFail.style.display = "none";
        resetGlobalCursor();
      }, 2000); // 2 секунды
    } finally {
      // Скрытие спиннера
      const spinner = document.getElementById("spinner");
      spinner.style.display = "none";
    }
  });
}
