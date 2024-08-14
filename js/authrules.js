document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.authorize-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.querySelector('#login').value.trim();
        const password = document.querySelector('#password').value.trim();

    // Проверка на валидность
        if (!login) {
            alert('Логин не может быть пустым');
            return;
        }
        if (!password) {
            alert('Пароль не может быть пустым');
            return;
        }

    // Отправка запроса на аутентификацию
        try {
            const response = await fetch('http://localhost:8081/WebChat/api/signIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ login, password })
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;

                // Сохранение токена в localStorage
                localStorage.setItem('token', token);

                // Открытие WebSocket соединения
                const socket = new SockJS('ws://localhost:8081/WebChat/api/ws');
                const stompClient = Stomp.over(socket);

                stompClient.connect({}, (frame) => {
                    console.log('Connected: ' + frame);

                    // Подписка на канал чата
                    stompClient.subscribe('user/invite', (messageOutput) => {
                        showMessage(JSON.parse(messageOutput.body));
                    });

                    // Переход на страницу mainchat.html
                    window.location.href = 'mainchat.html';
                });
            } else {
                console.error('Authentication failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

function showMessage(message) {
    console.log('Received message:', message);
}