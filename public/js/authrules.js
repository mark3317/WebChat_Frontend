document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.authorize-form');

    loginForm.addEventListener('submit', async (event) => {
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

        // Отправка запроса на аутентификацию
        try {
            const response = await fetch('http://localhost:8081/WebChat/api/signIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({login, password})
            });
            if (response.ok) {
                const token = await response.text();
                localStorage.setItem('token', token);

                //? Подключение к SockJS серверу
                const socket = new SockJS('http://localhost:8081/WebChat/api/ws');
                const stompClient = Stomp.over(socket);

                //? Подключение к STOMP серверу
                stompClient.connect({}, (frame) => {
                    console.log('Connected: ' + frame);

                    //? Подписка на ответ сервера
                    stompClient.subscribe('/user/invite', (message) => {
                        const response = JSON.parse(message.body);
                        alert(response.message);
                    });

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
