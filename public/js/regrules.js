document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('register').addEventListener('click', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value;

        if (username.trim() === '') {
            alert('Имя пользователя не должно быть пустым');
            return;
        }

        if (username.length < 3 || username.length > 24) {
            alert('Имя пользователя должно содержать не менее 3 и не более 24 символов');
            return;
        }

        if (password.length < 6 || password.length > 24) {
            alert('Пароль должен быть не менее 6 и не более 24 символов');
            return;
        }

        const usernameRegex = /^[a-zA-Zа-яА-Я0-9]+$/;
        if (!usernameRegex.test(username)) {
            alert('Имя пользователя должно содержать только буквы и цифры');
            return;
        }

        const passwordRegex = /^[a-zA-Zа-яА-Я0-9]+$/;
        if (!passwordRegex.test(password)) {
            alert('Пароль должен содержать только буквы и цифры');
            return;
        }

        if (email.trim() === '') {
            alert('Email не должен быть пустым');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Введите корректный email');
            return;
        }

        const data = { username, password, email };

        fetch('https://example.com/api/authorize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = 'mainchat.html';
            } else {
                alert('Ошибка: ' + data.message);
            }
        })
        .catch(error => {
            alert('Ошибка сети: ' + error.message);
        });
    });
});