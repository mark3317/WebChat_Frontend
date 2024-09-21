const loginPage = document.querySelector(".authorize-form");
if (loginPage) // Логика для отображения пароля
document.getElementById("showPassword").addEventListener("change", function() {
    const passwordField = document.getElementById("password");
    if (this.checked) passwordField.type = "text";
    else passwordField.type = "password";
});
const registrationPage = document.querySelector(".registration");
if (registrationPage) // Логика для отображения пароля
document.getElementById("showPassword").addEventListener("change", function() {
    const passwordField = document.getElementById("floatingPassword");
    const confirmPasswordField = document.getElementById("floatingConfirmPassword");
    if (this.checked) {
        passwordField.type = "text";
        confirmPasswordField.type = "text";
    } else {
        passwordField.type = "password";
        confirmPasswordField.type = "password";
    }
});

//# sourceMappingURL=index.e989c8f0.js.map
