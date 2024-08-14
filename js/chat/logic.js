document.addEventListener('DOMContentLoaded', function() {
    const userList = document.getElementById('user-list');
    const selectChatHeader = document.getElementById('select-chat');
    const homeButton = document.getElementById('home-button');
    const messagesDiv = document.getElementById('messages');
    const smsArticle = document.querySelector('article.sms');
    const nickname = document.getElementById('nickname').textContent;
    const formHTML = `
        <form id="message-form">
            <input type="text" id="message-input" placeholder="Введите сообщение..." required>
            <button type="submit" id="send-button">Отправить</button>
        </form>
    `;

    // Открытие чата при клике на пользователя
    // userList.addEventListener('click', function() {
    //     if (!document.getElementById('message-form')) {
    //         const chatContainer = document.getElementById('chat-container');
    //         chatContainer.insertAdjacentHTML('beforeend', formHTML);
    //         selectChatHeader.style.display = 'none';
    //     }
    //     smsArticle.classList.remove('hidden'); // Показываем содержимое
    // });

    // Возврат на главную страницу
    homeButton.addEventListener('click', function() {
        const messageForm = document.getElementById('message-form');
        if (messageForm) {
            messageForm.remove();
            selectChatHeader.style.display = 'block';
        }
        smsArticle.classList.add('hidden'); // Скрываем содержимое

        // Добавляем класс для анимации моргания
        selectChatHeader.classList.add('blink');
        // Удаляем класс после завершения анимации
        setTimeout(() => {
            selectChatHeader.classList.remove('blink');
        }, 1000);
    });

    // Прокрутка вниз при добавлении нового сообщения
    function scrollToBottom() {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // Обработка отправки сообщения
    document.addEventListener('submit', function(event) {
        event.preventDefault();
        const messageInput = document.getElementById('message-input');
        if (messageInput && messageInput.value.trim() !== '') {
            const newMessage = document.createElement('div');
            newMessage.classList.add('message');
            newMessage.innerHTML = `<span class="nickname">${nickname}:</span> ${messageInput.value}`;
            messagesDiv.appendChild(newMessage);
            messageInput.value = '';
            scrollToBottom();
        }
    });

    // Модальное окно
    const modal = document.getElementById('addFriendModal');
    const btn = document.querySelector('.add-friend-button');
    const span = document.querySelector('.close');
    const form = document.getElementById('addFriendForm');
    const responseMessage = document.getElementById('responseMessage');

    // Открытие модального окна
    btn.onclick = function() {
        modal.style.display = 'block';
    }

    // Закрытие модального окна
    span.onclick = function() {
        modal.style.display = 'none';
        responseMessage.textContent = '';
    }

    // Закрытие модального окна при клике вне его
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            responseMessage.textContent = '';
        }
    }

    // Обработка отправки формы добавления друга
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const friendName = document.getElementById('friendName').value;

        fetch('/add-friend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: friendName })
        })
        .then(response => {
            if (response.ok) {
                responseMessage.textContent = 'Запрос успешно отправлен';
                responseMessage.style.color = 'green';
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            responseMessage.textContent = 'Ошибка сети';
            responseMessage.style.color = 'red';
        });
    });
});