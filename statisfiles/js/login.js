async function loginHandler() {
    const login = document.querySelector('.auth-modal__input-username')
    const password = document.querySelector('.auth-modal__input-password')
    const BASE_URL = window.location.origin
    const error = document.querySelector('.auth-modal__error-message')
    const errorData = document.querySelector('.auth-modal__error-data')

    if (login.value === '' || password.value === '') {
        error.textContent = 'Заполните все поля.'
        errorData.classList.add('auth-modal__error-data--visible')
    } else {
        const request = await fetch(`${BASE_URL}/users/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'login': login.value,
                'password': password.value
            })
        })
        const data = await request.json()
        if (request.status === 200) {
            localStorage.setItem('isLoggingOut', false)
            window.location.href = '/'
        } else {
            error.textContent = data.error
            errorData.classList.add('auth-modal__error-data--visible')
        }
    }
}

const switchRegisterButton = document.querySelector('.auth-modal__button-switch-to-register')
const switchLoginButton = document.querySelector('.auth-modal__button-switch-to-login')
const registerForm = document.querySelector('.auth-modal-register__wrapper')
const loginForm = document.querySelector('.auth-modal-login__wrapper')

switchRegisterButton.addEventListener('click', () => {
    loginForm.classList.add('auth-modal-login__wrapper--hidden')
    registerForm.classList.remove('auth-modal-register__wrapper--hidden')
})

switchLoginButton.addEventListener('click', () => {
    registerForm.classList.add('auth-modal-register__wrapper--hidden')
    loginForm.classList.remove('auth-modal-login__wrapper--hidden')
})

async function logout() {
    const BASE_URL = window.location.origin

    const request = await fetch(`${BASE_URL}/users/logout/`, {
        method: 'POST',
        credentials: 'include',
        cache: 'reload',
        headers: {
            'X-CSRFToken': window.csrfToken,
        }
    })
    localStorage.clear()
    localStorage.setItem('isLoggingOut', true)
    window.location.href = '/'
}

function initLoginCont() {
    const registerCont = document.querySelector('.register')
    const loginCont = document.querySelector('.login-cont')
    if (registerCont) {
        registerCont.style.display = 'none'
        loginCont.style.display = 'flex'
    }

    localStorage.removeItem('showLogin')
}


async function registerHandler() {
    const email = document.querySelector('.auth-modal-register__input-email')
    const login = document.querySelector('.auth-modal-register__input-username')
    const password = document.querySelector('.auth-modal-register__input-password')
    const password2 = document.querySelector('.auth-modal-register__input-password2')
    const data = [email.value, login.value, password.value, password2.value]
    document.querySelector('.auth-modal-register__email-error').textContent = ''
    document.querySelector('.auth-modal-register__username-error').textContent = ''
    document.querySelector('.auth-modal-register__password-error').textContent = ''
    document.querySelector('.auth-modal-register__password2-error').textContent = ''

    const BASE_URL = window.location.origin
    if (data.includes('')) {
        const error = document.querySelector('.auth-modal-register__error-message')
        const errorData = document.querySelector('.auth-modal-register__error-data')
        error.textContent = 'Заполните все поля.'
        errorData.classList.add('auth-modal-register__error-data--visible')
    } else {
        const request = await fetch(`${BASE_URL}/users/register/`, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({
                'email': email.value,
                'login': login.value,
                'password1': password.value,
                'password2': password2.value,
            })
        })

        const data = await request.json()
        console.log(data)

        if (request.status === 200) {
            localStorage.setItem('isLoggingOut', false)
            window.location.href = '/'
        } else {
            for (let i in data.error) {
                const error = document.querySelector(`.auth-modal-register__${i}-error`)
                error.textContent = data.error[i]
            }
            const error = document.querySelector('.auth-modal-register__error-data')
            errorData.classList.remove('auth-modal-register__error-data--visible')
        }
    }
}