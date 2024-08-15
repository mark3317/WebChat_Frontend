document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.authorize-form');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;

    //todo Проверка на валидность
        if (!login) {
            alert('Логин не может быть пустым');
            return;
        }
        if (!password) {
            alert('Пароль не может быть пустым');
            return;
        }

//? Подключение к SockJS серверу
const socket = new SockJS('/ws');
const stompClient = Stomp.over(socket);

//? Подключение к STOMP серверу
stompClient.connect({}, (frame) => {
    console.log('Connected: ' + frame);

    //? Отправка данных авторизации
    stompClient.send('/app/auth', {}, JSON.stringify({ login, password }));

    //? Подписка на ответ сервера
    stompClient.subscribe('/user/queue/auth', (message) => {
        const response = JSON.parse(message.body);
        if (response.success) {
            window.location.href = 'mainchat.html';
        } else {
            alert('Ошибка авторизации');
        }
    });
});
});
});
