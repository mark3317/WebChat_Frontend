// Toggle password visibility
document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;
    confirmPasswordField.type = type;
});

// Check if passwords match on form submit
document.getElementById('register').addEventListener('submit', function (event) {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (password !== confirmPassword) {
        alert('Пароли должны быть одинаковы');
        event.preventDefault(); // Prevent form submission
    }
});