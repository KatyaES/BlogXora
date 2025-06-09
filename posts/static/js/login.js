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
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({
                'login': login.value,
                'password': password.value
            })
        })
        const data = await request.json()
        if (request.status === 200) {
            localStorage.setItem('access', data.access)
            localStorage.setItem('refresh', data.refresh)
            window.location.href = '/'
        } else {
            const error = document.querySelector('.error-message')
            const errorData = document.querySelector('.error-data')
            error.textContent = data.error
            errorData.style.display = 'flex'
        }
    }
}

document.getElementById("second-button").addEventListener('click', () => {
    const registerCont = document.querySelector('.register')
    const loginCont = document.querySelector('.login-cont')

    registerCont.style.display = 'none'
    loginCont.style.display = 'flex'
})

document.getElementById("login-second-button").addEventListener('click', () => {
    const registerCont = document.querySelector('.register')
    const loginCont = document.querySelector('.login-cont')

    registerCont.style.display = 'flex'
    loginCont.style.display = 'none'
})

async function logout() {
    const request = await fetch('http://127.0.0.1:8000/users/logout/')
    window.location.href = '/'
    localStorage.clear()
}

document.addEventListener('DOMContentLoaded', () => {
    const registerCont = document.querySelector('.register')
    const loginCont = document.querySelector('.login-cont')
    registerCont.style.display = 'none'
    loginCont.style.display = 'flex'
    localStorage.removeItem('showLogin')
})


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
    console.log(data)
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
            localStorage.setItem('access', data.access)
            localStorage.setItem('refresh', data.refresh)
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