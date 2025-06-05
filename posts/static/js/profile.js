async function settings(img) {
    const BASE_URL = window.location.origin
    window.location.href = `${BASE_URL}/users/profile_settings/`
}

document.addEventListener('DOMContentLoaded', () => {
    const settingsPasswordWrapper = document.querySelector('.settings_password-wrapper')
    settingsPasswordWrapper.style.display = 'none';

});

function showChangeWrapper() {
    const settingsPasswordWrapper = document.querySelector('.settings_password-wrapper')
    if (settingsPasswordWrapper.style.display === 'none') {
        settingsPasswordWrapper.style.display = 'flex';
    } else { settingsPasswordWrapper.style.display = 'none'; }
}

async function saveProfileData() {
    const token = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')

    const username = document.querySelector('.settings_username').value
    const email = document.querySelector('.settings_email').value
    const about = document.querySelector('.settings_about').value
    const BASE_URL = window.location.origin

    const request = await fetch(`${BASE_URL}/users/change-settings-data/`, {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                'username':username,
                'email':email,
                'about':about,
            })
    })
    if (request.status === 204) {
        location.reload()
    } else {
        const errorElem = document.querySelector('.error-data-message')
        errorElem.style.display = 'flex'
    }
}


async function changePassword(element) {
    const token = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')

    const username = element.getAttribute('data-key')

    const BASE_URL = window.location.origin

    const oldPassword = document.querySelector('.settings_old-password').value
    const newPassword = document.querySelector('.settings_new-password').value
    const newPassword2 = document.querySelector('.settings_new-password-2').value



    const request = await fetch(`${BASE_URL}/users/change-settings-password/`, {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                'old_password':oldPassword,
                'new_password':newPassword,
                'new_password2':newPassword2,
            })
    })
    const data = await request.json()
    if (request.status === 204) {

         const request = await fetch(`${BASE_URL}/users/login/`, {
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify({
                    'login': username,
                    'password': newPassword
                })
        })
        const data = await request.json()
        localStorage.setItem('access', data.access)
        localStorage.setItem('refresh', data.refresh)
        const successElem = document.querySelector('.success-message')
        successElem.style.display = 'flex'
    } else {
        const errorElem = document.querySelector('.error-password-message')
        errorElem.style.display = 'flex'
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('last_click') === 'notification') {
        notificationFunc()
    }

    if (window.location.hash.endsWith('id')) {
        const hash = window.location.hash
        const cont = document.querySelector(`.${hash.slice(1, -3)}-cont`)
        cont.classList.add('active')
        cont.style.borderLeft = '3px solid var(--main-color)'
        cont.querySelector('a').style.color = 'var(--main-color)'
    }
})

function notificationFunc() {
    const notificationCont = document.querySelector('.notification-count')
    const notificationWrapper = document.querySelector('.notification_wrapper')
    notificationCont.style.display = 'none'
    notificationWrapper.style.width = '20px'

    localStorage.setItem('last_click', 'notification')
}



function adminRedirect() {
    const BASE_URL = window.location.origin
    window.location.href = `${BASE_URL}/admin`
}

