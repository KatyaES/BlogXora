async function settings(img) {
    window.location.href = 'http://127.0.0.1:8000/users/settings/'
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

    const request = await fetch(`http://127.0.0.1:8000/api/change-settings-data/`, {
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
        console.log('success')
        location.reload()
    } else {
        console.log(400)
        const errorElem = document.querySelector('.error-data-message')
        errorElem.style.display = 'flex'
    }
}


async function changePassword() {
    const token = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')

    const oldPassword = document.querySelector('.settings_old-password').value
    const newPassword = document.querySelector('.settings_new-password').value
    const newPassword2 = document.querySelector('.settings_new-password-2').value

    const request = await fetch(`http://127.0.0.1:8000/api/change-settings-password/`, {
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
    if (request.status === 204) {
        console.log('success')
        location.reload()
    } else {
        console.log(400)
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



