async function settings(img) {
    const BASE_URL = window.location.origin
    window.location.href = `${BASE_URL}/settings/`
}

function initSettingsPasswordWrapper() {
    const settingsPasswordWrapper = document.querySelector('.settings_password-wrapper')
    if (settingsPasswordWrapper) {
        settingsPasswordWrapper.style.display = 'none';
    }
};

function showChangeWrapper() {
    const settingsPasswordWrapper = document.querySelector('.settings_password-wrapper')
    if (settingsPasswordWrapper.style.display === 'none') {
        settingsPasswordWrapper.style.display = 'flex';
    } else { settingsPasswordWrapper.style.display = 'none'; }
}

async function saveProfileData() {
    const status = await window.checkToken()

    const username = document.querySelector('.settings_username').value
    const email = document.querySelector('.settings_email').value
    const about = document.querySelector('.settings_about').value
    const BASE_URL = window.location.origin

    if (username.trim().length < 4) {
        const usernameError = document.querySelector('.username_error')
        usernameError.textContent = 'Имя пользователя слишком короткое.'
        usernameError.style.color = '#e54848'
    } else {
        if (status) {
            const request = await fetch(`${BASE_URL}/users/change-settings-data/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': window.csrfToken,
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
                const data = await request.json()
                const dataError = document.querySelector('.data_error')
                const usernameError = document.querySelector('.username_error')
                dataError.textContent = data.error
                dataError.style.color = '#e54848'

                usernameError.textContent = ''
            }
        }
    }
}


async function changePassword(element) {
    const errorElem = document.querySelector('.error-password-message')
    errorElem.textContent = ''
    const status = await window.checkToken()

    const username = element.getAttribute('data-key')

    const BASE_URL = window.location.origin

    const oldPassword = document.querySelector('.settings_old-password').value
    const newPassword = document.querySelector('.settings_new-password').value

    if (!oldPassword || !newPassword) return;

    if (status) {
        const request = await fetch(`${BASE_URL}/users/change-settings-password/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({
                'old_password':oldPassword,
                'new_password':newPassword,
            })
        })
        const data = await request.json()
        if (request.status === 200) {

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
            const successElem = document.querySelector('.success-message')
            window.location.reload()
            alert('Пароль успешно обновлен')
        } else {
            if (data.error.length) {
                for (let i = 0; i < data.error.length; i++) {
                    errorElem.innerHTML += data.error[i] + '<br>'
                }
            } else {
                errorElem.innerHTML += data.error + '<br>'
            }
            errorElem.style.display = 'flex'

        }
    }
}


function adminRedirect() {
    const BASE_URL = window.location.origin
    window.location.href = `${BASE_URL}/admin`
}


function profileFollowersFunc(element) {
    element.style.backgroundColor = 'rgb(231, 232, 234)'

    const profileFollows = document.querySelector('.profile_follows')
    const profileFollowersWrapper = document.querySelector('.followers_wrapper')
    const profileFollowingsWrapper = document.querySelector('.followings_wrapper')
    const profilePosts = document.querySelector('.profile-posts')
    const profileBookmarks = document.querySelector('.profile-bookmarks')
    const profileComments = document.querySelector('.profile-comments')
    const profileHeaderNavCont = document.querySelector('.profile-header-nav-cont')
    const profileFollowings = document.querySelector('.profile-followings')

    profileFollowings.style.backgroundColor = ''
    profileHeaderNavCont.innerHTML = ''
    profilePosts.style.backgroundColor = ''
    profileComments.style.backgroundColor = ''
    if (profileBookmarks) {
        profileBookmarks.style.backgroundColor = ''
    }


    profileFollowersWrapper.style.display = 'flex'
    profileFollowingsWrapper.style.display = 'none'
    profileFollows.style.display = 'flex'
    window.followFunc()
}

function profileSubscribesFunc(element) {
    element.style.backgroundColor = 'rgb(231, 232, 234)'

    const profileFollows = document.querySelector('.profile_follows')
    const profileFollowersWrapper = document.querySelector('.followers_wrapper')
    const profileFollowingsWrapper = document.querySelector('.followings_wrapper')
    const profilePosts = document.querySelector('.profile-posts')
    const profileComments = document.querySelector('.profile-comments')
    const profileBookmarks = document.querySelector('.profile-bookmarks')
    const profileHeaderNavCont = document.querySelector('.profile-header-nav-cont')
    const profileFollowers = document.querySelector('.profile-followers')

    profileHeaderNavCont.innerHTML = ''
    profilePosts.style.backgroundColor = ''
    profileComments.style.backgroundColor = ''
    if (profileBookmarks) {
        profileBookmarks.style.backgroundColor = ''
    }
    profileFollowers.style.backgroundColor = ''
    profileFollowersWrapper.style.display = 'none'
    profileFollowingsWrapper.style.display = 'flex'
    profileFollows.style.display = 'flex'
    initUserFollows()
}

function notificationFunc() {
    const notificationContainer = document.querySelector('.notification_container')
    if (notificationContainer.classList.contains('clicked')) {
        notificationContainer.classList.remove('clicked')
    } else {
        notificationContainer.classList.add('clicked')
    }
}