async function loginHandler() {
    const login = document.querySelector('.username-form')
    const password = document.querySelector('.password-form')
    const BASE_URL = window.location.origin

    if (login.value === '' || password.value === '') {
        const error = document.querySelector('.error-message')
        const errorData = document.querySelector('.error-data')
        error.textContent = 'Заполните все поля.'
        errorData.style.display = 'flex'
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
            const error = document.querySelector('.error-message')
            const errorData = document.querySelector('.error-data')
            error.textContent = data.error
            errorData.style.display = 'flex'
        }
    }
}

const secondButton = document.getElementById("second-button")
if (secondButton) {
    secondButton.addEventListener('click', () => {
        const registerCont = document.querySelector('.register')
        const loginCont = document.querySelector('.login-cont')

        registerCont.style.display = 'none'
        loginCont.style.display = 'flex'
    })
}

const loginSecondButton = document.getElementById("login-second-button")
if (loginSecondButton) {
    loginSecondButton.addEventListener('click', () => {
        const registerCont = document.querySelector('.register')
        const loginCont = document.querySelector('.login-cont')

        registerCont.style.display = 'flex'
        loginCont.style.display = 'none'
    })
}

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
    const email = document.querySelector('.reg-email-form')
    const login = document.querySelector('.reg-username-form')
    const password1 = document.querySelector('.reg-password-form')
    const password2 = document.querySelector('.reg-password2-form')
    const data = [email.value, login.value, password1.value, password2.value]
    document.querySelector('.reg-username-error').textContent = ''
    document.querySelector('.reg-email-error').textContent = ''
    document.querySelector('.reg-password-error').textContent = ''
    document.querySelector('.reg-password2-error').textContent = ''

    const BASE_URL = window.location.origin
    if (data.includes('')) {
        const error = document.querySelector('.reg_error-message')
        const errorData = document.querySelector('.reg_error-data')
        error.textContent = 'Заполните все поля.'
        errorData.style.display = 'flex'
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
                'password1': password1.value,
                'password2': password2.value,
            })
        })

        const data = await request.json()

        if (request.status === 200) {
            localStorage.setItem('isLoggingOut', false)
            window.location.href = '/'
        } else {
            for (let i in data.error) {
                const error = document.querySelector(`.reg-${i}-error`)
                error.textContent = data.error[i]
            }
            const error = document.querySelector('.reg_error-data')
            error.style.display = 'none'
        }
    }
}