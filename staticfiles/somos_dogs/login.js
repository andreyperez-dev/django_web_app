document.addEventListener('DOMContentLoaded', () => {  
    const sign_in_form = document.querySelector("#sign-in-form");
    sign_in_form.addEventListener("submit", (event) => {
        event.preventDefault();
        login()
    });

    const register_form = document.querySelector("#register-form");
    register_form.addEventListener('submit', (event) => {
        event.preventDefault();
        register();
    });

    const sign_in_btn = document.querySelector("#signin-btn");
    const register_btn = document.querySelector("#register-btn");
    const container = document.querySelector(".container");

    register_btn.addEventListener('click', () => {
        container.classList.add("register-mode");
    });

    sign_in_btn.addEventListener('click', () => {
        container.classList.remove("register-mode");
    });

    function getCsrfToken(formid){
        const csrfForm = document.querySelector(`#${formid}`);
        if (csrfForm){
            const csrfToken = csrfForm.querySelector('input[name=csrfmiddlewaretoken]');
            if (csrfToken){
                return csrfToken.value;
            }  
        } 
        return null;      
    }
    
    function login(){
        const username = document.querySelector("#s_username").value;
        const password = document.querySelector("#s_password").value;
        const csrfToken = getCsrfToken('sign-in-form')

        fetch("/somos_dogs/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.error !== undefined) {
                let error_div = document.querySelector("#s_error");
                alert(`${result.error}`)
                error_div.textContent = result.error
            }
            else if (result.success !== undefined){
                window.location.reload()
            }
        });
    }
        
    function register(){
        const username = document.querySelector("#r_username").value;
        const email = document.querySelector("#r_email").value;
        const password = document.querySelector("#r_password").value;
        const confirmation = document.querySelector("#r_confirmation").value;
        const csrfToken = getCsrfToken('register-form');

        fetch("/somos_dogs/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                confirmation: confirmation
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result)
            let error_div = document.querySelector("#r_error");
            if (result.error) {
                alert(`${result.error}`)
                error_div.textContent = result.error;
            }
            else if (result.success) {
                window.location.reload()
            }
        });
    }
});