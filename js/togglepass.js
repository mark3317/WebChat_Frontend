// Совпадение паролей
function validatePassword() {
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm-password").value;
    if (password != confirmPassword) {
        alert("Пароли не совпадают");
        return false;
    }
    return true;
}
// Переключение видимости пароля
function togglePassword(passwordId) {
    var passwordField = document.getElementById(passwordId);
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
}

