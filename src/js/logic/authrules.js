import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import jwt_decode from 'jwt-decode';

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

    const socket = new SockJS('http://localhost:8081/WebChat/api/ws');
    const stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
            console.log(str);
        }
    });

    stompClient.onConnect = (frame) => {
        console.log('Connected: ' + frame);

        // Подписка на ответ сервера
        stompClient.subscribe('/user/invite', (message) => {
            const response = JSON.parse(message.body);
            alert(response.message);
        });

        // Извлечение токена из localStorage (или другого источника)
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwt_decode(token);
            const username = decodedToken.sub; // Извлечение subject (username)
            console.log('Username from token:', username);
        } else {
            console.log('Token not found');
        }
    };

    stompClient.activate();

    try {
        const response = await fetch('http://localhost:8081/WebChat/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login, password })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Login successful:', data);
            // Дополнительные действия после успешного входа
        } else {
            alert('Ошибка входа');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ошибка сети');
    }
});