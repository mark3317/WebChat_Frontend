import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { jwtDecode } from 'jwt-decode';

const loginForm = document.querySelector('.authorize-form');
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    // Проверка на валидность
    if (!login) {
        alert('Логин не может быть пустым');
        return;
    }
    if (!password) {
        alert('Пароль не может быть пустым');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/signIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login, password })
        });

        if (response.ok) {
            const token = response.body.toString();
            console.log('Login successful:', token);
            localStorage.setItem('token', token);

            if (token) {
                const decodedToken = jwtDecode(token);
                const username = decodedToken.sub; // Извлечение subject (username)
                console.log('Username from token:', username);
                // Дополнительные действия после успешного входа
                connectWebsocket(username);
            } else {
                console.log('Token not found');
            }
        } else {
            alert('Ошибка входа');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ошибка сети');
    }
});

function connectWebsocket(username) {
    const socket = new SockJS('http://localhost:8080/api/ws');
    const stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
            console.log(str);
        }
    });

    stompClient.onConnect = (frame) => {
        console.log('Connected: ' + frame);
        // Подписка на ответ сервера
        stompClient.subscribe(`/user/${username}/invite`, (message) => {
            const response = JSON.parse(message.body);
            alert(response.message);
        });
    };
    stompClient.activate();
}