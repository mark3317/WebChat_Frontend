document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('message-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const messageInput = document.getElementById('message-input');
        const messageText = messageInput.value.trim();
        if (messageText !== '') {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.textContent = messageText;
            document.getElementById('messages').appendChild(messageElement);
            messageInput.value = '';
            messageInput.focus();
        }
    });
});