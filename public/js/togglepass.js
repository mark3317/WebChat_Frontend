document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('toggle-password').addEventListener('click', function() {
        togglePassword('password');
    });
});

function togglePassword(id) {
    const element = document.getElementById(id);
    if (element.type === "password") {
        element.type = "text";
    } else {
        element.type = "password";
    }
}

// Совпадение паролей
function validatePassword() {
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm-password").value;
    if (password !== confirmPassword) {
        alert("Пароли не совпадают");
        return false;
    }
    return true;
}