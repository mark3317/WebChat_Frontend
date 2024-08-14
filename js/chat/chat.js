document.addEventListener('DOMContentLoaded', (event) => {
    // Получение токена из localStorage или sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    let nickname = 'empty';

    // Декодирование токена и извлечение ника пользователя
    if (token) {
        try {
            const decodedToken = jwt_decode(token);
            nickname = decodedToken.sub || 'empty';
        } catch (error) {
            console.error('Invalid token:', error);
        }
    }

    // Установка ника пользователя
    document.querySelector('#nickname').textContent = nickname;

    // Подключение к WebSocket
    var socket = new SockJS('/ws');
    var stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);

        stompClient.subscribe('/topic/public', function (messageOutput) {
            showMessage(JSON.parse(messageOutput.body));
        });
    });

    // Обработка отправки формы
    document.querySelector('#messageForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var messageContent = document.querySelector('#message').value.trim();
        if (messageContent && stompClient) {
            var chatMessage = {
                sender: nickname,
                content: messageContent
            };
            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
            document.querySelector('#message').value = '';
        }
    });
});

function showMessage(message) {
    var messageElement = document.createElement('li');
    messageElement.classList.add('chat-message');
    messageElement.innerText = message.sender + ": " + message.content;
    document.querySelector('#messages').appendChild(messageElement);
}