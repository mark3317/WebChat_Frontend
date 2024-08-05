function togglePassword(passwordId) {
            var passwordField = document.getElementById(passwordId);
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
            } else {
                passwordField.type = 'password';
            }
        }
