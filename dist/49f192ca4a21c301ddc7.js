const loginPage = document.querySelector(".authorize-form");
if (loginPage) {
  // Логика для отображения пароля
  document
    .getElementById("showPassword")
    .addEventListener("change", function () {
      var passwordField = document.getElementById("password");
      if (this.checked) {
        passwordField.type = "text";
      } else {
        passwordField.type = "password";
      }
    });
}
const registrationPage = document.querySelector(".registration");
if (registrationPage) {
  // Логика для отображения пароля
  document
    .getElementById("showPassword")
    .addEventListener("change", function () {
      var passwordField = document.getElementById("floatingPassword");
      var confirmPasswordField = document.getElementById(
        "floatingConfirmPassword"
      );
      if (this.checked) {
        passwordField.type = "text";
        confirmPasswordField.type = "text";
      } else {
        passwordField.type = "password";
        confirmPasswordField.type = "password";
      }
    });
}
