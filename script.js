const sqlite3 = require('sqlite3').verbose();

function swapBody(current, target) {
    document.getElementById(current).style.display = 'none';
    document.getElementById(target).style.display = 'block';
}

function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add('form__message--${type}');
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");
    const forgotPasswordForm = document.querySelector("#forgotPassword");

    loginForm.addEventListener("submit", e => {
        e.preventDefault();

        // login

        setFormMessage(loginForm, "error", "Invalid ID/password");
    });


    forgotPasswordForm.addEventListener("submit", e => {
        e.preventDefault();

        // Create Account

        setFormMessage(forgotPasswordForm, "error", "Invalid ID/email address");
    });

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "setPassword" && e.target.value.length > 0 && e.target.value.length < 9) {
                setInputError(inputElement, "Password must be at least 9 characters in length");
            }
            if (e.target.id === "confirmPassword" && document.forms["createName"]["psd1"].value != document.forms["createName"]["psd2"].value) {
                setInputError(inputElement, "Password does not match above");
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});