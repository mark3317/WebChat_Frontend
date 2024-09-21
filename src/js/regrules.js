import { setGlobalCursorWait, resetGlobalCursor } from "./cursorlogic";

const registrationForm = document.querySelector(".registration");

//* Назначение переменных для элементов формы и спинера
if (registrationForm) {
  registrationForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Предотвращаем стандартное поведение формы

    const usernameField = document.getElementById("floatingNickname");
    const emailField = document.getElementById("floatingInput");
    const passwordField = document.getElementById("floatingPassword");
    const confirmPasswordField = document.getElementById(
      "floatingConfirmPassword"
    );

    let username = usernameField.value;
    let email = emailField.value;
    let password = passwordField.value;
    let confirmPassword = confirmPasswordField.value;

    const butNormal = document.getElementById("but_normal");
    const butWarning = document.getElementById("but_warning");
    const butWarning2 = document.getElementById("but_warning2");
    const butWarning3 = document.getElementById("but_warning3");
    const butFail = document.getElementById("but_fail");
    const butSuccess = document.getElementById("but_success");
    const spinner = document.getElementById("spinner");

    let showSpinner = () => {
      spinner.style.display = "block";
      setGlobalCursorWait();
    };

    let hideSpinner = () => {
      spinner.style.display = "none";
      resetGlobalCursor();
    };

    let showSuccess = () => {
      butNormal.style.display = "none";
      butSuccess.style.display = "block";
      setTimeout(() => {
        butNormal.style.display = "block";
        butSuccess.style.display = "none";
        hideSpinner();
      }, 2000);
    };

    let showFail = () => {
      butNormal.style.display = "none";
      butFail.style.display = "block";
      setTimeout(() => {
        butNormal.style.display = "block";
        butFail.style.display = "none";
        hideSpinner();
      }, 2000);
    };

    let showWarning = (button) => {
      butNormal.style.display = "none";
      button.style.display = "block";
      setTimeout(() => {
        butNormal.style.display = "block";
        button.style.display = "none";
        hideSpinner();
      }, 2000);
    };

    //* Проверка на заполненность полей
    if (!username || !email || !password || !confirmPassword) {
      showWarning(butWarning);
      return;
    }

    // Проверка на совпадение паролей
    if (password !== confirmPassword) {
      showWarning(butWarning2);
      return;
    }

    // Проверка на корректность email
    if (email.includes("@")) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showWarning(butWarning3);
        return;
      }
    }

    // Отображение спиннера и установка глобального курсора "wait"
    showSpinner();

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

        showSuccess();

        setTimeout(() => {
          // Перенаправление на страницу входа или другую страницу
          window.location.href = "../../src/html/index.html";
        }, 2000); // 2 секунды
      } else {
        console.log("Registration failed");
        showFail();
      }
    } catch (error) {
      console.error("Error during registration:", error);
      showFail();
    }
  });
}
