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

document.addEventListener("DOMContentLoaded", function() {
    $('button.loginButton').click( function() {
        $('form.loginForm').submit();
    });
    $('button.forgetButton').click( function() {
        $('form.forgetForm').submit();
    });
    
    const loginForm = document.querySelector("#login");
    const forgotPasswordForm = document.querySelector("#forgotPassword");

    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
    });
    
    forgotPasswordForm.addEventListener("submit", function(e) {
        e.preventDefault();
    });
});