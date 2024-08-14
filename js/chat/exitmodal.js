document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы
    const logoutButton = document.getElementById('logout-button');
    const modal = document.getElementById('logout-modal');
    const closeModal = document.getElementById('close-modal');
    const confirmLogout = document.getElementById('confirm-logout');
    const cancelLogout = document.getElementById('cancel-logout');

    // Открытие модального окна при нажатии на кнопку logout
    logoutButton.onclick = function() {
        modal.style.display = 'block';
    }

    // Закрытие модального окна при нажатии на крестик
    closeModal.onclick = function() {
        modal.style.display = 'none';
    }

    // Закрытие модального окна при нажатии на кнопку "Нет"
    cancelLogout.onclick = function() {
        modal.style.display = 'none';
    }

    // Переход на страницу при нажатии на кнопку "Да"
    confirmLogout.onclick = function() {
        window.location.href = 'index.html';
    }

    // Закрытие модального окна при клике вне его
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});