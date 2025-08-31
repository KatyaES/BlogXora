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
    const status = await window.checkToken()

    const username = element.getAttribute('data-key')

    const BASE_URL = window.location.origin

    const oldPassword = document.querySelector('.settings_old-password').value
    const newPassword = document.querySelector('.settings_new-password').value
    const newPassword2 = document.querySelector('.settings_new-password-2').value


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
    const notificationCount = document.querySelector('.notification-count')
    const notificationWrapper = document.querySelector('.notification_wrapper')
    notificationCount.style.display = 'none'
    notificationWrapper.style.width = '20px'

    localStorage.setItem('last_click', 'notification')
}



function adminRedirect() {
    const BASE_URL = window.location.origin
    window.location.href = `${BASE_URL}/admin`
}


async function selfPosts(element) {
    const user = element.getAttribute('data-id')
    const BASE_URL = window.location.origin
    const profileHeaderNavCont = document.querySelector('.profile-header-nav-cont')

    element.style.backgroundColor = 'rgb(231, 232, 234)'
    const selfComments = document.querySelector('.self-profile-comments')
    selfComments.style.backgroundColor = ''

    const request = await fetch(`${BASE_URL}/frontend_api/v1/${user}/posts/`, {
        method: 'GET',
        credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		}
    })

    const data = await request.json()
    console.log(data)

    const oldPosts = document.querySelectorAll('.post-wrapper')

    if (oldPosts) {
        oldPosts.forEach(post => post.remove())
    }
    for (let i = 0; i < data.length; i++) {
        const posts = `
            <div class="posts">
                <div class="user-photo-name">
                    <div class="user">
                        <img src="${data[i].image}">
                            <div class="name-and-date-category">
                                <div class="username">
                                    <a href="${BASE_URL}/users/profile/${data[i].user}">${data[i].user}</a>
                                    <span style="color: gray;">${smart_time(data[i].pub_date)}</span>
                                </div>
                            </div>
                        </div>
                        ${user !== data[i].user
                            ? `<div class="follow-btn" onclick="followFunc(this)" data-id="${data[i].user_id}" datatype="${user}">Подписаться</div>`
                            : ''
                        }
                    </div>
                <br>
                    <a href="${BASE_URL}/category/?theme=${data[i].category}" class="post_category">${data[i].category}</a>
                <br>
                <br>
                <div class="title">
                    <a href="/home/post/${data[i].id}">${data[i].title}</a>
                </div>
                <br>
                <div class="ql-editor">
                    <img src="${data[i].wrapp_img}" alt="">
                    <p>${splitContent(data[i].content)}</p>
                </div>
                <div class="detail-button">
                    <a href="/home/post/${data[i].id}/#top">Читать далее</a>
                </div>
                <div class="icon-cont">
                    <div class="post-reactions">
                        <div class="like-wrapper" id="wrapper-id" onclick="func(this)" data-id="${data[i].id}">
                            <img src="/media/icons/hart.png" class="heart-img" id="like-button">
                            <span class="likes-count" id="likes-count-${data[i].id}">${data[i].liked_by.length}</span>
                        </div>
                        <div class="comment-wrapper">
                            <a href="/home/post/${data[i].id}/">
                                <img src="/media/icons/comment.svg" class="comment-img">
                            </a>
                            <span class="comment-count">${data[i].comment_count}</span>
                        </div>
                        <div class="bookmark-wrapper" onclick="setBookmark(this)" data-id="${data[i].id}" data-section="bookmarks">
                            <a>
                                <img src="/media/icons/bookmark.svg" class="bookmark-img">
                            </a>
                            <span class="bookmark-count" id="bookmark-count-${data[i].id}">${data[i].bookmark_user.length}</span>
                        </div>
                    </div>
                    <div class="view-wrapper">
                        <img src="/media/icons/view.svg" class="views-img">
                        <span class="views-count">${data[i].views_count}</span>
                    </div>
                </div>
            </div>
        `
        profileHeaderNavCont.innerHTML = ''
        profileHeaderNavCont.insertAdjacentHTML('beforeend', posts)
    }
    window.likesUpdate()
    window.bookmarksUpdate()
}

async function selfComments(element) {
    const user = element.getAttribute('data-id')
    const BASE_URL = window.location.origin
    const currentUser = element.getAttribute('data-auth')
    const profileHeaderNavCont = document.querySelector('.profile-header-nav-cont')

    element.style.backgroundColor = 'rgb(231, 232, 234)'
    const selfPosts = document.querySelector('.self-profile-posts')
    selfPosts.style.backgroundColor = ''

    const request = await fetch(`${BASE_URL}/frontend_api/v1/${user}/comments/`, {
        method: 'GET',
        credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		}
    })

    const data = await request.json()
    console.log(data)
    const oldComments = document.querySelectorAll('.comment-item')

    if (oldComments) {
        oldComments.forEach(comment => comment.remove())
    }
    for (let i = 0; i < data.length; i++) {
        const newComment = `
            <div class="comment-item" id="comment-item-${data[i].id}">
                <div class="comment-head">
                    <img src="${data[i].image}" alt="">
                    ${currentUser == data[i].username ? `
                    <div class="username_wrapper">
                        <a href="" style="color: white; font-weight: 500; font-size: 13px;">${data[i].username}</a></div>` : `${data[i].username}`}
                    <span style="color: gray; font-size: 14px;">${smart_time(data[i].pub_date)}</span>
                </div>
                <div class="comment-content">
                    ${data[i].description}
                </div>
                <div class="comment-reactions">
                    <div class="comment_like-wrapper" id="wrapper-id" onclick="setCommentLike(this)" data-id="${data[i].id}" data-type="common">
                        <img src="/media/icons/hart.png" class="comment_heart-img" id="like-button">
                        <span class="comment_likes-count" id="comment_likes-count-${data[i].id}">${data[i].likes}</span>
                    </div>
                    ${currentUser == data[i].username ? `
                    <span class="delete-comment" onclick="commentDelete(this)" id="${data[i].id}" data-key="${data[i].id}" data-type="common">Удалить</span>
                ` : ''}
                </div>
                <div class="reply_comment-wrapper" id="reply_comment-wrapper-${data[i].id}">
                    <textarea class="reply_comment-input" placeholder="Комментарий" id="reply_comment-input-${data[i].id}"></textarea>
                    <div class="reply_send-comment" id="reply_comment-${data[i].id}" onclick="replySendComment(this)" data-key="${data[i].id}" data-id="${data[i].id}">Отправить</div>
                </div>

            </div>
        `
        profileHeaderNavCont.innerHTML = ''
        profileHeaderNavCont.insertAdjacentHTML('beforeend', newComment)
    }
    window.commentLikedUpdate()
}


