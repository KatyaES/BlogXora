async function loginHandler() {
    const login = document.querySelector('.login-form')
    const password = document.querySelector('.password-form')
    const loginWarning = document.querySelector('.login-warning')
    const passWarning = document.querySelector('.pass-warning')
    const loginMinWarning = document.querySelector('.login-min-length-warning')
    const passMinWarning = document.querySelector('.pass-min-length-warning')
    const BASE_URL = window.location.origin

    if (login.value.length === 0) {
        loginWarning.style.display = 'flex'
        passWarning.style.display = 'none'
        login.style.border = '1px solid #c52828'
        password.style.border = '1px solid var(--main-border)'
    } else if (password.value.length === 0) {
        passWarning.style.display = 'flex'
        loginWarning.style.display = 'none'
        password.style.border = '1px solid #c52828'
        login.style.border = '1px solid var(--main-border)'
    } else if (login.value.length < 3) {
        login.style.border = '1px solid #c52828'
        password.style.border = '1px solid var(--main-border)'
        loginMinWarning.style.display = 'flex'
        loginWarning.style.display = 'none'
        passMinWarning.style.display = 'none'
        passWarning.style.display = 'none'
    } else if (password.value.length < 3) {
        password.style.border = '1px solid #c52828'
        login.style.border = '1px solid var(--main-border)'
        passMinWarning.style.display = 'flex'
        passWarning.style.display = 'none'
        loginMinWarning.style.display = 'none'
        loginWarning.style.display = 'none'
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
            errorData = document.querySelector('.error-data')
            errorData.style.display = 'flex'
            loginMinWarning.style.display = 'none'
            loginWarning.style.display = 'none'
            passMinWarning.style.display = 'none'
            passWarning.style.display = 'none'
            password.style.border = '1px solid var(--main-border)'
            login.style.border = '1px solid var(--main-border)'
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
    const email = document.querySelector('.email-form')
    const login = document.querySelector('.reg-login-form')
    const password1 = document.querySelector('.reg-password-form')
    const password2 = document.querySelector('.repeat-password-form')

    const regEmailWarning = document.querySelector('.reg-email-warning')
    const regLoginWarning = document.querySelector('.reg-login-warning')
    const regPass1Warning = document.querySelector('.reg-pass1-warning')
    const regPass2Warning = document.querySelector('.reg-pass2-warning')

    const regEmailMin = document.querySelector('.reg-email-min-length-warning')
    const regLoginMin = document.querySelector('.reg-login-min-length-warning')
    const regPass1Min = document.querySelector('.reg-pass1-min-length-warning')
    const regPass2Min = document.querySelector('.reg-pass2-min-length-warning')

    const BASE_URL = window.location.origin

    if (email.value.length === 0) {
        email.style.border = '1px solid #c52828'
        password2.style.border = '1px solid var(--main-border)'
        password1.style.border = '1px solid var(--main-border)'
        login.style.border = '1px solid var(--main-border)'

        regEmailWarning.style.display = 'flex'
        regLoginWarning.style.display = 'none'
        regPass1Warning.style.display = 'none'
        regPass2Warning.style.display = 'none'

        regEmailMin.style.display = 'none'
        regLoginMin.style.display = 'none'
        regPass1Min.style.display = 'none'
        regPass2Min.style.display = 'none'
    } else if (email.value.length < 3) {
        email.style.border = '1px solid #c52828'
        password2.style.border = '1px solid var(--main-border)'
        password1.style.border = '1px solid var(--main-border)'
        login.style.border = '1px solid var(--main-border)'
        
        regEmailMin.style.display = 'flex'
        regLoginMin.style.display = 'none'
        regPass1Min.style.display = 'none'
        regPass2Min.style.display = 'none'

        regPass2Warning.style.display = 'none'
        regLoginWarning.style.display = 'none'
        regEmailWarning.style.display = 'none'
        regPass1Warning.style.display = 'none'
    } else if (login.value.length === 0) {
        login.style.border = '1px solid #c52828'
        password1.style.border = '1px solid var(--main-border)'
        password2.style.border = '1px solid var(--main-border)'
        email.style.border = '1px solid var(--main-border)'

        regLoginWarning.style.display = 'flex'
        regEmailWarning.style.display = 'none'
        regPass1Warning.style.display = 'none'
        regPass2Warning.style.display = 'none'

        regEmailMin.style.display = 'none'
        regLoginMin.style.display = 'none'
        regPass1Min.style.display = 'none'
        regPass2Min.style.display = 'none'
    } else if (login.value.length < 3) {
        login.style.border = '1px solid #c52828'
        password1.style.border = '1px solid var(--main-border)'
        email.style.border = '1px solid var(--main-border)'
        email.style.border = '1px solid var(--main-border)'

        regEmailMin.style.display = 'none'
        regLoginMin.style.display = 'flex'
        regPass1Min.style.display = 'none'
        regPass2Min.style.display = 'none'

        regPass2Warning.style.display = 'none'
        regLoginWarning.style.display = 'none'
        regEmailWarning.style.display = 'none'
        regPass1Warning.style.display = 'none'
    } else if (password1.value.length === 0) {
        password1.style.border = '1px solid #c52828'
        password2.style.border = '1px solid var(--main-border)'
        login.style.border = '1px solid var(--main-border)'
        email.style.border = '1px solid var(--main-border)'

        regPass1Warning.style.display = 'flex'
        regPass2Warning.style.display = 'none'
        regEmailWarning.style.display = 'none'
        regLoginWarning.style.display = 'none'

        regEmailMin.style.display = 'none'
        regLoginMin.style.display = 'none'
        regPass1Min.style.display = 'none'
        regPass2Min.style.display = 'none'
    } else if (password1.value.length < 3) {
        password1.style.border = '1px solid #c52828'
        password2.style.border = '1px solid var(--main-border)'
        login.style.border = '1px solid var(--main-border)'
        email.style.border = '1px solid var(--main-border)'

        regEmailMin.style.display = 'none'
        regLoginMin.style.display = 'none'
        regPass1Min.style.display = 'flex'
        regPass2Min.style.display = 'none'

        regPass2Warning.style.display = 'none'
        regLoginWarning.style.display = 'none'
        regEmailWarning.style.display = 'none'
        regPass1Warning.style.display = 'none'
    } else if (password2.value.length === 0) {
        password2.style.border = '1px solid #c52828'
        password1.style.border = '1px solid var(--main-border)'
        login.style.border = '1px solid var(--main-border)'
        email.style.border = '1px solid var(--main-border)'

        regPass2Warning.style.display = 'flex'
        regLoginWarning.style.display = 'none'
        regEmailWarning.style.display = 'none'
        regPass1Warning.style.display = 'none'

        regEmailMin.style.display = 'none'
        regLoginMin.style.display = 'none'
        regPass1Min.style.display = 'none'
        regPass2Min.style.display = 'none'
    } else if (!(password2.value === password1.value)) {
        password2.style.border = '1px solid #c52828'
        password1.style.border = '1px solid var(--main-border)'
        login.style.border = '1px solid var(--main-border)'
        email.style.border = '1px solid var(--main-border)'
        regEmailMin.style.display = 'none'
        regLoginMin.style.display = 'none'
        regPass1Min.style.display = 'none'
        regPass2Min.style.display = 'flex'

        regPass2Warning.style.display = 'none'
        regLoginWarning.style.display = 'none'
        regEmailWarning.style.display = 'none'
        regPass1Warning.style.display = 'none'
    } else if (password1.value === password2.value) {
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
        }
    }
}