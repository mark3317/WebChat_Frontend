var $jACjv$jwtdecode = require("jwt-decode");
var $jACjv$sockjsclient = require("sockjs-client");
var $jACjv$stompstompjs = require("@stomp/stompjs");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}



function $5e4c0b8a54c15831$export$7f6e97fd02aec7ee() {
    spinner.style.display = "block";
    document.body.classList.add("cursor-wait");
}
function $5e4c0b8a54c15831$export$b287970d08d002e6() {
    spinner.style.display = "none";
    document.body.classList.remove("cursor-wait");
}


// Определение функции connectWebsocket для подключения к WebSocket
function $84d16c74a1f02aaa$var$connectWebsocket(username) {
    const socket = new (0, ($parcel$interopDefault($jACjv$sockjsclient)))("http://94.242.53.252:8081/api/ws");
    const stompClient = new (0, $jACjv$stompstompjs.Client)({
        webSocketFactory: ()=>socket,
        debug: (str)=>console.log(str)
    });
    // Обработчик успешного подключения
    stompClient.onConnect = (frame)=>{
        console.log("Connected: " + frame);
    };
    // Обработчик ошибок STOMP
    stompClient.onStompError = (frame)=>{
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
    };
    // Активация STOMP клиента
    stompClient.activate();
}
//* Назначение переменных для элементов формы и спиннера
const $84d16c74a1f02aaa$var$loginForm = document.querySelector(".authorize-form");
if ($84d16c74a1f02aaa$var$loginForm) $84d16c74a1f02aaa$var$loginForm.addEventListener("submit", async (event)=>{
    event.preventDefault();
    const login = document.getElementById("login").value;
    const password = document.getElementById("password").value;
    const spinner = document.getElementById("spinner");
    const butNormal = document.getElementById("but_normal");
    const butWarning = document.getElementById("but_warning");
    const butWarning3 = document.getElementById("but_warning3");
    const butFail = document.getElementById("but_fail");
    const butSuccess = document.getElementById("but_success");
    let showSpinner = ()=>{
        spinner.style.display = "block";
        (0, $5e4c0b8a54c15831$export$7f6e97fd02aec7ee)();
    };
    let hideSpinner = ()=>{
        spinner.style.display = "none";
        (0, $5e4c0b8a54c15831$export$b287970d08d002e6)();
    };
    let showSuccess = ()=>{
        butNormal.style.display = "none";
        butSuccess.style.display = "block";
        setTimeout(()=>{
            butNormal.style.display = "block";
            butSuccess.style.display = "none";
        }, 2000);
    };
    let showFail = ()=>{
        butNormal.style.display = "none";
        butFail.style.display = "block";
        setTimeout(()=>{
            butNormal.style.display = "block";
            butFail.style.display = "none";
        }, 2000);
    };
    let showWarning = (button)=>{
        butNormal.style.display = "none";
        button.style.display = "block";
        setTimeout(()=>{
            butNormal.style.display = "block";
            button.style.display = "none";
        }, 2000);
    };
    // Отображение спиннера и установка глобального курсора "wait"
    showSpinner();
    // Проверка наличия логина и пароля, корректность email
    if (!login) {
        showWarning(butWarning);
        hideSpinner();
        return;
    }
    if (!password) {
        showWarning(butWarning);
        hideSpinner();
        return;
    }
    if (login.includes("@")) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(login)) {
            showWarning(butWarning3);
            hideSpinner();
            return;
        }
    }
    //! Отправка запроса на сервер для авторизации
    try {
        const response = await fetch("http://94.242.53.252:8081/api/signIn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                login: login,
                password: password
            })
        });
        if (response.ok) {
            const token = await response.text();
            localStorage.setItem("token", token);
            if (token) {
                const decodedToken = (0, $jACjv$jwtdecode.jwtDecode)(token);
                const username = decodedToken.sub;
                localStorage.setItem("username", username);
                $84d16c74a1f02aaa$var$connectWebsocket(username);
                //* Выполнение GET запроса для получения профиля
                const profileResponse = await fetch("http://94.242.53.252:8081/api/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                // Получение и сохранение ID пользователя из профиля
                if (profileResponse.ok) {
                    const profileData = await profileResponse.json();
                    const userId = profileData.id;
                    localStorage.setItem("userId", userId);
                    showSuccess();
                    window.location.href = "../../src/html/mainchat.html";
                } else {
                    console.error("Failed to fetch profile data");
                    showFail();
                    hideSpinner();
                }
            } else hideSpinner();
        } else {
            showFail();
            hideSpinner();
        }
    } catch (error) {
        console.error("Error during login:", error);
        hideSpinner();
    }
});





var $a350f3ec8afb89f5$require$Client = $jACjv$stompstompjs.Client;


//# sourceMappingURL=main.js.map
