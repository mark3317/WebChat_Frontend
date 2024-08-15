document.addEventListener('DOMContentLoaded', () => {
    // Получаем элементы модального окна и кнопки
    const modal = document.querySelector('.modal');
    const addButton = document.querySelector('.add-friend-button');

    // Функция для открытия модального окна
    addButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Функция для закрытия модального окна
    const closeModal = () => {
        modal.style.display = 'none';
    };

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
});