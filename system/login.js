document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.querySelector('.loader');
    const passwordToggle = document.getElementById('password-toggle');
    const eyeOpen = document.querySelector('.eye-open');
    const eyeClosed = document.querySelector('.eye-closed');

    const ADMIN_USERNAME = 'admin12';
    const ADMIN_PASSWORD = 'lifewood';

    const showError = (input, message) => {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        input.parentElement.classList.add('error');
        errorElement.textContent = message;
    };
    
    const hideError = (input) => {
        const formGroup = input.parentElement;
        formGroup.classList.remove('error');
    };

    const validateForm = () => {
        let isValid = true;
        hideError(usernameInput);
        hideError(passwordInput);
        if (usernameInput.value.trim() === '') {
            showError(usernameInput, 'Username is required.');
            isValid = false;
        }
        if (passwordInput.value.trim() === '') {
            showError(passwordInput, 'Password is required.');
            isValid = false;
        }
        return isValid;
    };
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validateForm()) { return; }

        btnText.style.display = 'none';
        loader.style.display = 'block';
        submitBtn.disabled = true;

        const enteredUsername = usernameInput.value.trim();
        const enteredPassword = passwordInput.value.trim();

        setTimeout(() => {
            if (enteredUsername === ADMIN_USERNAME && enteredPassword === ADMIN_PASSWORD) {
                console.log('Login successful! Redirecting to the correct dashboard...');
                // ===============================================================
                // CRITICAL FIX: This now points to the HTML file in the root
                // project folder, NOT the one inside /system.
                // ===============================================================
                window.location.href = 'admin-dashboard.html';

            } else {
                console.log('Login failed.');
                showError(passwordInput, 'Invalid username or password.');
                btnText.style.display = 'block';
                loader.style.display = 'none';
                submitBtn.disabled = false;
            }
        }, 1000);
    });

    // --- Other event listeners ---
    passwordToggle.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        eyeOpen.style.display = isPassword ? 'none' : 'block';
        eyeClosed.style.display = isPassword ? 'block' : 'none';
    });

    usernameInput.addEventListener('input', () => {
        if (usernameInput.value.trim() !== '') hideError(usernameInput);
    });
    passwordInput.addEventListener('input', () => {
        if (passwordInput.value.trim() !== '') hideError(passwordInput);
    });
});