document.addEventListener('DOMContentLoaded', () => {
    element = document.getElementById('profile-nav__item_1')
    profilePostsFunc(element)
})

async function settings(img) {
    const BASE_URL = window.location.origin
    window.location.href = `${BASE_URL}/settings/`
}

async function profileBookmarksFunc(element) {
    const user = element.getAttribute('data-id')
    const BASE_URL = window.location.origin
    const profileHeaderNavCont = document.querySelector('.profile-header-nav-cont')
    profileHeaderNavCont.innerHTML = ''
    const profileNavItems = document.querySelectorAll('.profile-nav__item')
    profileNavItems.forEach(el => {
        if (el !== element) {
            el.style.borderBottom = ''
            el.style.borderBottom = ''
            el.style.borderBottom = ''
            el.style.borderBottom = ''
        }
        element.style.borderBottom = '3.5px solid var(--main-color)'
    })



    nextPostsPageUrl = `${BASE_URL}/frontend_api/v1/posts/get_my_bookmarks_posts/${user}`
    nextCommentsPageUrl = `${BASE_URL}/frontend_api/v1/comments/get_my_bookmarks_comments/${user}`
    isLoadingPosts = false;
    isLoadingComments = false;
    postsContainer = profileHeaderNavCont
    localStorage.setItem('isSearchMode', 'false')
    const isSearchMode = localStorage.getItem('isSearchMode')

    const oldPosts = document.querySelectorAll('.post-wrapper')

    if (oldPosts) {
        oldPosts.forEach(post => post.remove())
    }

    const oldComments = document.querySelectorAll('.comment-item')

    if (oldComments) {
        oldComments.forEach(comment => comment.remove())
    }
    profileHeaderNavCont.innerHTML = ''

    initPostLikes();
    initPostBookmarks();
    initUserFollows();
    initCommentBookmarks();
    initCommentLikes();
}

function profile(username, element=null) {
    window.location.href = `${BASE_URL}/users/${username}/`
    if (element) {
        const profileBookmarks = document.querySelector(`.${element}`)
        console.log(profileBookmarks)
        profileBookmarks.addEventListener('click', profileBookmarksFunc)
    }
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


async function profileFollowersFunc(element) {
    userId = element.getAttribute('data-auth')
    const profileHeaderNavCont = document.querySelector('.profile-header-nav-cont')
    const followersWrapper = document.createElement('div')
    followersWrapper.classList.add('followers_wrapper')
    followersWrapper.style.display = 'flex'
    isLoadingComments = false;
    isLoadingPosts = true;
    localStorage.setItem('isSearchMode', 'false')

    profileHeaderNavCont.appendChild(followersWrapper)
    profileHeaderNavCont.innerHTML = ''
    followersWrapper.innerHTML = ''
    const profileNavItems = document.querySelectorAll('.profile-nav__item')
    profileNavItems.forEach(el => {
        if (el !== element) {
            el.style.borderBottom = ''
            el.style.borderBottom = ''
            el.style.borderBottom = ''
            el.style.borderBottom = ''
        }
        element.style.borderBottom = '3.5px solid var(--main-color)'
    })

    postsContainer = profileHeaderNavCont

    const oldSubscriptions = document.querySelectorAll('.follower')

    if (oldSubscriptions) {
        oldSubscriptions.forEach(subscription => subscription.remove())
    }
    profileHeaderNavCont.innerHTML = ''

    const response = await fetch(`${BASE_URL}/frontend_api/v1/subscription/${userId}/get_followers`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    if (data.followers.length === 0) {
        followersWrapper.style.display = 'none'
    }

    postsContainer = profileHeaderNavCont
    for (let i = 0; i < data.followers.length; i++) {
        const follower = `
            <div class="follower">
                <div class="username-img-wrapper">
                    <img src=${data.followers[i].image} class="following_image">
                    <a class="subs_username" onclick="profile('${data.followers[i].username}')" >${data.followers[i].username}</a>
                </div>
                <div class="follow-btn" onclick="userFollows(this)" data-id="${data.followers[i].id}" datatype="${username}">Подписаться</div>
            </div>
        `
        followersWrapper.insertAdjacentHTML('beforeend', follower)
    }
    postsContainer.appendChild(followersWrapper)
    initUserFollows()

}


async function profileSubscribesFunc(element) {
    userId = element.getAttribute('data-auth')
    const profileHeaderNavCont = document.querySelector('.profile-header-nav-cont')
    const followingsWrapper = document.createElement('div')
    followingsWrapper.classList.add('followings_wrapper')
    followingsWrapper.style.display = 'flex'
    isLoadingComments = false;
    isLoadingPosts = true;
    localStorage.setItem('isSearchMode', 'false')

    profileHeaderNavCont.appendChild(followingsWrapper)
    profileHeaderNavCont.innerHTML = ''
    followingsWrapper.innerHTML = ''
    const profileNavItems = document.querySelectorAll('.profile-nav__item')
    profileNavItems.forEach(el => {
        if (el !== element) {
            el.style.borderBottom = ''
            el.style.borderBottom = ''
            el.style.borderBottom = ''
            el.style.borderBottom = ''
        }
        element.style.borderBottom = '3.5px solid var(--main-color)'
    })

    postsContainer = profileHeaderNavCont

    const oldSubscriptions = document.querySelectorAll('.following')

    if (oldSubscriptions) {
        oldSubscriptions.forEach(subscription => subscription.remove())
    }
    profileHeaderNavCont.innerHTML = ''

    const response = await fetch(`${BASE_URL}/frontend_api/v1/subscription/${userId}/get_followers`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    if (data.followings.length === 0) {
        followingsWrapper.style.display = 'none'
    }
    postsContainer = profileHeaderNavCont
    for (let i = 0; i < data.followings.length; i++) {
        const following = `
            <div class="following">
                <div class="username-img-wrapper">
                    <img src=${data.followings[i].image} class="following_image">
                    <a class="subs_username" onclick="profile('${data.followings[i].username}')" >${data.followings[i].username}</a>
                </div>
                ${username !== data.followings[i].username
                    ?`<div class="follow-btn" onclick="userFollows(this)" data-id="${data.followings[i].id}" datatype="${username}">Подписаться</div>`
                    : ``
                }
            </div>
        `
        followingsWrapper.insertAdjacentHTML('beforeend', following)
    }
    postsContainer.appendChild(followingsWrapper)
    initUserFollows()
}

function notificationFunc() {
    const notificationContainer = document.querySelector('.notification_container')
    const notificationCount = document.querySelector('.notification-count')
    notificationCount.classList.add('hidden')
    localStorage.setItem('isNotificationCountActive', false)
    if (notificationContainer.classList.contains('clicked')) {
        notificationContainer.classList.remove('clicked')
    } else {
        notificationContainer.classList.add('clicked')
    }
}

function initHiddenNotifications() {
    const notificationsState = localStorage.getItem('isNotificationCountActive')
    const notificationCount = document.querySelector('.notification-count')
    if (notificationsState === 'false') {
        notificationCount.classList.add('hidden')
    } else {
        notificationCount.classList.remove('hidden')
    }
}

