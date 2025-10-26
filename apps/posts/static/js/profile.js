async function settings(img) {
    const BASE_URL = window.location.origin
    window.location.href = `${BASE_URL}/settings/`
}

async function profileBookmarksFunc() {
    const bookmarkButton = document.getElementById('profile-nav__item_2')
    const user = bookmarkButton.getAttribute('data-id')
    const BASE_URL = window.location.origin
    const profileHeaderNavCont = document.querySelector('.profile-header-nav-cont')
    profileHeaderNavCont.innerHTML = ''
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
    const photo = document.querySelector('.settings-photo').value
    console.log(photo)

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

function initLoadProfileData() {
    const path = window.location.pathname
    if (path.endsWith('/bookmarks/')) {
        const bookmarkButton = document.getElementById('profile-nav__item_2')
        const profileNavItems = document.querySelectorAll('.profile-nav__item')
        profileNavItems.forEach(el => {
            if (el !== bookmarkButton) {
                el.style.borderBottom = ''

            }
            bookmarkButton.style.borderBottom = '3.5px solid var(--main-color)'
            bookmarkButton.style.color = 'var(--main-color)'
        })
        profileBookmarksFunc()
    }

    if (path.endsWith('/followers/')) {
        const followersButton = document.getElementById('profile-nav__item_4')
        const profileNavItems = document.querySelectorAll('.profile-nav__item')
        profileNavItems.forEach(el => {
            if (el !== followersButton) {
                el.style.borderBottom = ''
            }
            followersButton.style.borderBottom = '3.5px solid var(--main-color)'
            followersButton.style.color = 'var(--main-color)'
        })
        profileFollowersFunc()
    }
    if (path.endsWith('/subscribes/')) {
        const subscribesButton = document.getElementById('profile-nav__item_3')
        const profileNavItems = document.querySelectorAll('.profile-nav__item')
        profileNavItems.forEach(el => {
            if (el !== subscribesButton) {
                el.style.borderBottom = ''
            }
            subscribesButton.style.borderBottom = '3.5px solid var(--main-color)'
            subscribesButton.style.color = 'var(--main-color)'
        })
        profileSubscribesFunc()
    }
    if (path.endsWith('/posts/') || path.endsWith(`/${currentProfile}/`)) {
        const postsButton = document.getElementById('profile-nav__item_1')
        const profileNavItems = document.querySelectorAll('.profile-nav__item')
        profileNavItems.forEach(el => {
            if (el !== postsButton) {
                el.style.borderBottom = ''
            }
            postsButton.style.borderBottom = '3.5px solid var(--main-color)'
            postsButton.style.color = 'var(--main-color)'
        })
        profilePostsFunc()
    }
    if (path.endsWith('/comments/')) {
        const commentButton = document.getElementById('profile-nav__item_5')
        const profileNavItems = document.querySelectorAll('.profile-nav__item')

        profileNavItems.forEach(el => {
            if (el !== commentButton) {
                el.style.borderBottom = ''
            }
            commentButton.style.borderBottom = '3.5px solid var(--main-color)'
            commentButton.style.color = 'var(--main-color)'
        })
        profileCommentsFunc()
    }
}

async function profileFollowersFunc() {
    const followersButton = document.getElementById('profile-nav__item_4')
    userId = followersButton.getAttribute('data-auth')
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

    postsContainer = profileHeaderNavCont

    const oldFollowers = document.querySelectorAll('.follower')

    if (oldFollowers) {
        oldFollowers.forEach(follower => follower.remove())
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
                <div class="button-follow" onclick="userFollows(this)" data-id="${data.followers[i].id}" datatype="${currentUser}">Подписаться</div>
            </div>
        `
        followersWrapper.insertAdjacentHTML('beforeend', follower)
    }
    postsContainer.appendChild(followersWrapper)
    initUserFollows()

}


async function profileSubscribesFunc() {
    const subscribesButton = document.getElementById('profile-nav__item_3')
    userId = subscribesButton.getAttribute('data-auth')
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
                ${currentUser !== data.followings[i].username
                    ?`<div class="button-follow" onclick="userFollows(this)" data-id="${data.followings[i].id}" datatype="${currentUser}">Подписаться</div>`
                    : ``
                }
            </div>
        `
        followingsWrapper.insertAdjacentHTML('beforeend', following)
    }
    postsContainer.appendChild(followingsWrapper)
    initUserFollows()
}

const notificationsWrapper = document.querySelector('.site-header__icon-notifications-wrapper')

notificationsWrapper.addEventListener('click', () => {
    const notificationContainer = document.querySelector('.site-header__notification-container')
    const notificationCount = document.querySelector('.site-header__notifications-count')
    notificationCount.classList.add('hidden')
    localStorage.setItem('isNotificationCountActive', false)
    if (notificationContainer.classList.contains('clicked')) {
        notificationContainer.classList.remove('clicked')
    } else {
        notificationContainer.classList.add('clicked')
    }
})



function profileMenuFunc(element) {
    const profileMenu = document.querySelector('.site-header__account-menu')
    if (profileMenu.classList.contains('clicked')) {
        profileMenu.classList.remove('clicked')
    } else {
        profileMenu.classList.add('clicked')
    }
}

document.addEventListener('click', function (event) {
    const profileMenu = document.querySelector('.site-header__account-menu')
    const profileButton = document.querySelector('.site-header__account-img')
    const notificationButton = document.querySelector('.site-header__icon-notifications-wrapper')
    const notificationContainer = document.querySelector('.site-header__notification-container')

    if (!profileMenu.contains(event.target) && !profileButton.contains(event.target)) {
        profileMenu.classList.remove('clicked')
    }

    if (!notificationButton.contains(event.target) && !notificationContainer.contains(event.target)) {
        notificationContainer.classList.remove('clicked')
    }
})

function initHiddenNotifications() {
    const notificationsState = localStorage.getItem('isNotificationCountActive')
    const notificationCount = document.querySelector('.site-header__notifications-count')
    if (notificationCount) {
        if (notificationsState === 'false') {
            notificationCount.classList.add('hidden')
        } else {
            notificationCount.classList.remove('hidden')
        }
    }

}
