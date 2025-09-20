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

async function profileBookmarksFunc(element) {
    const user = element.getAttribute('data-id')
    const BASE_URL = window.location.origin
    const profileHeaderNavCont = document.querySelector('.profile-header-nav-cont')

    element.style.backgroundColor = 'rgb(231, 232, 234)'
    const profileFollows = document.querySelector('.profile_follows')
    const profileComments = document.querySelector('.profile-comments')
    const profilePosts = document.querySelector('.profile-posts')
    const profileFollowings = document.querySelector('.profile-followings')
    const profileFollowers = document.querySelector('.profile-followers')

    profileFollowings.style.backgroundColor = ''
    profileFollowers.style.backgroundColor = ''
    profilePosts.style.backgroundColor = ''
    profileComments.style.backgroundColor = ''
    profileFollows.style.display = 'none'


    const request = await fetch(`${BASE_URL}/frontend_api/v1/${user}/bookmarks/`, {
        method: 'GET',
        credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		}
    })

    const data = await request.json()

    const oldPosts = document.querySelectorAll('.post-wrapper')

    if (oldPosts) {
        oldPosts.forEach(post => post.remove())
    }

    const oldComments = document.querySelectorAll('.comment-item')

    if (oldComments) {
        oldComments.forEach(comment => comment.remove())
    }
    profileHeaderNavCont.innerHTML = ''
    for (let i = 0; i < data.posts.length; i++) {
        const posts = `
            <div class="posts">
                <div class="user-photo-name">
                    <div class="user">
                        <img src="${data.posts[i].image}">
                            <div class="name-and-date-category">
                                <div class="username">
                                    <a href="${BASE_URL}/users/${data.posts[i].user}">${data.posts[i].user}</a>
                                    <span style="color: gray;">${smart_time(data.posts[i].pub_date)}</span>
                                </div>
                            </div>
                        </div>
                        ${user !== data.posts[i].user
                            ? `<div class="follow-btn" onclick="followFunc(this)" data-id="${data.posts[i].user_id}" datatype="${user}">Подписаться</div>`
                            : ''
                        }
                    </div>
                <br>
                    <a href="${BASE_URL}/category/?theme=${data.posts[i].category}" class="post_category">${data.posts[i].category}</a>
                <br>
                <br>
                <div class="title">
                    <a href="/post/${data.posts[i].id}">${data.posts[i].title}</a>
                </div>
                <br>
                <div class="ql-editor">
                    ${data.posts[i].wrapp_img
                        ? `<img src="${data.posts[i].wrapp_img}" alt="">`
                        : ''
                    }
                    <p>${splitContent(data.posts[i].content)}</p>
                </div>
                <div class="detail-button">
                    <a href="/post/${data.posts[i].id}/#top">Читать далее</a>
                </div>
                <div class="icon-cont">
                    <div class="post-reactions">
                        <div class="like-wrapper" id="wrapper-id" onclick="func(this)" data-id="${data.posts[i].id}">
                            <img src="/media/icons/hart.png" class="heart-img" id="like-button">
                            <span class="likes-count" id="likes-count-${data.posts[i].id}">${data.posts[i].liked_by.length}</span>
                        </div>
                        <div class="comment-wrapper">
                            <a href="/post/${data.posts[i].id}/">
                                <img src="/media/icons/comment.svg" class="comment-img">
                            </a>
                            <span class="comment-count">${data.posts[i].comment_count}</span>
                        </div>
                        <div class="bookmark-wrapper" onclick="setBookmark(this)" data-id="${data.posts[i].id}" data-section="bookmarks">
                            <a>
                                <svg class="bookmark-img" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M6 2C5.44772 2 5 2.44772 5 3V21C5 21.2761 5.22386 21.5 5.5 21.5C5.63261 21.5 5.76522 21.4477 5.85355 21.3536L12 15.7071L18.1464 21.3536C18.2348 21.4477 18.3674 21.5 18.5 21.5C18.7761 21.5 19 21.2761 19 21V3C19 2.44772 18.5523 2 18 2H6Z" stroke-width="2"/>
                                </svg>
                            </a>
                            <span class="bookmark-count" id="bookmark-count-${data.posts[i].id}">${data.posts[i].bookmark_user.length}</span>
                        </div>
                    </div>
                    <div class="view-wrapper">
                        <img src="/media/icons/view.svg" class="views-img">
                        <span class="views-count">${data.posts[i].views_count}</span>
                    </div>
                </div>
            </div>
        `
        profileHeaderNavCont.insertAdjacentHTML('beforeend', posts)


    }
    for (let i = 0; i < data.comments.length; i++) {
        const newComment = `
            <div class="profile_comment-item" id="comment-item-${data.comments[i].post_id}">
                <a href="/post/${data.comments[i].post_id}" class="post_of_comment">${data.comments[i].post}</a>
                <div class="comment-item" id="comment-item-${data.comments[i].id}">
                    <div class="comment-head">
                        <img src="${data.comments[i].image}" alt="">
                        ${user == data.comments[i].username ? `
                        <div class="username_wrapper">
                            <a href="" style="color: white; font-weight: 500; font-size: 13px;">${data.comments[i].username}</a></div>` : `${data.comments[i].username}`}
                        <span class="comment_pub-date">только что</span>
                    </div>
                    <div class="comment-content">
                        ${data.comments[i].description}
                    </div>
                    <div class="comment-reactions">
                        <div class="comment_like-wrapper" id="wrapper-id" onclick="setCommentLike(this)" data-id="${data.comments[i].id}" data-type="common">
                            <img src="/media/icons/hart.png" class="comment_heart-img" id="like-button">
                            <span class="comment_likes-count" id="comment_likes-count-${data.comments[i].id}">${data.comments[i].likes}</span>
                        </div>
                        <div class="comment_bookmark-wrapper" onclick="setCommentBookmark(this)" data-id="${data.comments[i].id}" data-section="bookmarks">
                            <a>
                                <svg class="comment_bookmark-img" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M6 2C5.44772 2 5 2.44772 5 3V21C5 21.2761 5.22386 21.5 5.5 21.5C5.63261 21.5 5.76522 21.4477 5.85355 21.3536L12 15.7071L18.1464 21.3536C18.2348 21.4477 18.3674 21.5 18.5 21.5C18.7761 21.5 19 21.2761 19 21V3C19 2.44772 18.5523 2 18 2H6Z" stroke-width="2"/>
                                </svg>
                            </a>
                            <span class="comment_bookmark-count" id="comment_bookmark-count-${data.comments[i].id}">${data.comments[i].bookmarked_by.length}</span>
                        </div>
                        <span class="reply" onclick="commentReply(this)" data-id="${data.id}">Ответить</span>
                        ${user == data.comments[i].username ? `
                        <span class="delete-comment" onclick="commentDelete(this)" id="${data.comments[i].id}" data-key="${data.comments[i].id}" data-type="common" data-id="${data.comments[i].post_id}">Удалить</span>
                    ` : ''}
                    </div>
                    <div class="reply_comment-wrapper" id="reply_comment-wrapper-${data.comments[i].id}">
                        <textarea class="reply_comment-input" placeholder="Комментарий" id="reply_comment-input-${data.comments[i].id}"></textarea>
                        <div class="reply_send-comment" id="reply_comment-${data.comments[i].id}" onclick="replySendComment(this)" data-field-id="${data.comments[i].post_id}}" data-key="${data.comments[i].id}" data-id="${data.comments[i].id}">Отправить</div>
                    </div>
                </div>
            </div>
        `
        profileHeaderNavCont.insertAdjacentHTML('beforeend', newComment)

    }
    window.likesUpdate()
    window.bookmarksUpdate()
    window.commentBookmarksUpdate()
    window.commentLikedUpdate()
    window.domFollowFunc()
}

async function profilePostsFunc(element) {
    const user = element.getAttribute('data-id')
    const BASE_URL = window.location.origin
    const profileHeaderNavCont = document.querySelector('.profile-header-nav-cont')

    element.style.backgroundColor = 'rgb(231, 232, 234)'
    const profileFollows = document.querySelector('.profile_follows')
    const profileComments = document.querySelector('.profile-comments')
    const profileBookmarks = document.querySelector('.profile-bookmarks')
    const profileFollowings = document.querySelector('.profile-followings')
    const profileFollowers = document.querySelector('.profile-followers')

    profileFollowings.style.backgroundColor = ''
    profileFollowers.style.backgroundColor = ''
    profileComments.style.backgroundColor = ''
    if (profileBookmarks) {
        profileBookmarks.style.backgroundColor = ''
    }
    profileFollows.style.display = 'none'

    const request = await fetch(`${BASE_URL}/frontend_api/v1/${user}/posts/`, {
        method: 'GET',
        credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		}
    })

    const data = await request.json()

    const oldPosts = document.querySelectorAll('.post-wrapper')

    if (oldPosts) {
        oldPosts.forEach(post => post.remove())
    }
    profileHeaderNavCont.innerHTML = ''
    for (let i = 0; i < data.length; i++) {
        const posts = `
            <div class="posts">
                <div class="user-photo-name">
                    <div class="user">
                        <img src="${data[i].image}">
                            <div class="name-and-date-category">
                                <div class="username">
                                    <a href="${BASE_URL}/users/${data[i].user}">${data[i].user}</a>
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
                    ${data[i].wrapp_img
                        ? `<img src="${data[i].wrapp_img}" alt="">`
                        : ''
                    }
                    <p>${splitContent(data[i].content)}</p>
                </div>
                <div class="detail-button">
                    <a href="/post/${data[i].id}/#top">Читать далее</a>
                </div>
                <div class="icon-cont">
                    <div class="post-reactions">
                        <div class="like-wrapper" id="wrapper-id" onclick="func(this)" data-id="${data[i].id}">
                            <img src="/media/icons/hart.png" class="heart-img" id="like-button">
                            <span class="likes-count" id="likes-count-${data[i].id}">${data[i].liked_by.length}</span>
                        </div>
                        <div class="comment-wrapper">
                            <a href="/post/${data[i].id}/">
                                <img src="/media/icons/comment.svg" class="comment-img">
                            </a>
                            <span class="comment-count">${data[i].comment_count}</span>
                        </div>
                        <div class="bookmark-wrapper" onclick="setBookmark(this)" data-id="${data[i].id}" data-section="bookmarks">
                            <a>
                                <svg class="bookmark-img" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M6 2C5.44772 2 5 2.44772 5 3V21C5 21.2761 5.22386 21.5 5.5 21.5C5.63261 21.5 5.76522 21.4477 5.85355 21.3536L12 15.7071L18.1464 21.3536C18.2348 21.4477 18.3674 21.5 18.5 21.5C18.7761 21.5 19 21.2761 19 21V3C19 2.44772 18.5523 2 18 2H6Z" stroke-width="2"/>
                                </svg>
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
        profileHeaderNavCont.insertAdjacentHTML('beforeend', posts)
    }
    window.likesUpdate()
    window.bookmarksUpdate()
}

async function profileCommentsFunc(element) {
    const user = element.getAttribute('data-id')
    const BASE_URL = window.location.origin
    const currentUser = element.getAttribute('data-auth')
    const profileHeaderNavCont = document.querySelector('.profile-header-nav-cont')

    element.style.backgroundColor = 'rgb(231, 232, 234)'
    const profileFollows = document.querySelector('.profile_follows')
    const profilePosts = document.querySelector('.profile-posts')
    const profileBookmarks = document.querySelector('.profile-bookmarks')
    const profileFollowings = document.querySelector('.profile-followings')
    const profileFollowers = document.querySelector('.profile-followers')

    profileFollowings.style.backgroundColor = ''
    profileFollowers.style.backgroundColor = ''
    profilePosts.style.backgroundColor = ''
    if (profileBookmarks) {
        profileBookmarks.style.backgroundColor = ''
    }
    profileFollows.style.display = 'none'

    const request = await fetch(`${BASE_URL}/frontend_api/v1/${user}/comments/`, {
        method: 'GET',
        credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		}
    })

    const data = await request.json()
    const oldComments = document.querySelectorAll('.comment-item')

    if (oldComments) {
        oldComments.forEach(comment => comment.remove())
    }
    profileHeaderNavCont.innerHTML = ''
    for (let i = 0; i < data.length; i++) {
        const newComment = `
            <div class="profile_comment-item" id="comment-item-${data[i].id}">
                <a href="/post/${data[i].post_id}" class="post_of_comment">${data[i].post}</a>
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
                    <div class="comment_bookmark-wrapper" onclick="setCommentBookmark(this)" data-id="${data[i].id}" data-section="bookmarks">
                        <a>
                            <svg class="comment_bookmark-img" width="24" height="24" viewBox="0 0 24 24">
                                <path d="M6 2C5.44772 2 5 2.44772 5 3V21C5 21.2761 5.22386 21.5 5.5 21.5C5.63261 21.5 5.76522 21.4477 5.85355 21.3536L12 15.7071L18.1464 21.3536C18.2348 21.4477 18.3674 21.5 18.5 21.5C18.7761 21.5 19 21.2761 19 21V3C19 2.44772 18.5523 2 18 2H6Z" stroke-width="2"/>
                            </svg>
                        </a>
                        <span class="comment_bookmark-count" id="comment_bookmark-count-${data[i].id}">${data[i].bookmarked_by.length}</span>
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
        profileHeaderNavCont.insertAdjacentHTML('beforeend', newComment)
    }
    window.commentLikedUpdate()
    window.commentBookmarksUpdate()
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
    window.followFunc()
}

