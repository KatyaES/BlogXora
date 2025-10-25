async function sendComment(div) {
    const id = div.getAttribute('data-field-id')
	const comment = document.getElementById(`comment-${id}`)
	console.log(id)
	console.log(comment)
	console.log(comment.value)
	const postId = div.getAttribute('data-id')
	console.log(postId)


	const status = await window.checkToken()
    const BASE_URL = window.location.origin

    try {
        if (comment.value) {
            if (status) {
                const request = await fetch(`${BASE_URL}/frontend_api/v1/comments/`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                    body: JSON.stringify({
                        'comment': comment.value,
                        'post': postId,
                    })
                })

                const data = await request.json()
                console.log(data)

                const newComment = `
                    <div class="comment-item" id="comment-item-${data.id}">
                        <div class="comment-head">
                            <img src="${data.image}" alt="">
                            ${currentUser == data.username ? `
                            <div class="username_wrapper">
                                <a href="" style="color: white; font-weight: 500; font-size: 13px;">${data.username}</a></div>` : `${data.username}`}
                            <span class="comment_pub-date">только что</span>
                        </div>
                        <div class="comment-content">
                            ${data.description}
                        </div>
                        <div class="comment-reactions">
                            <div class="comment_like-wrapper" id="wrapper-id" onclick="setCommentLike(this)" data-id="${data.id}" data-type="common">
                                <img src="/media/icons/hart.png" class="comment_heart-img" id="like-button">
                                <span class="comment_likes-count" id="comment_likes-count-${data.id}">${data.likes}</span>
                            </div>
                            <div class="comment_bookmark-wrapper" onclick="setCommentBookmark(this)" data-id="${data.id}" data-section="bookmarks">
                                <a>
                                    <svg class="comment_bookmark-img" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M6 2C5.44772 2 5 2.44772 5 3V21C5 21.2761 5.22386 21.5 5.5 21.5C5.63261 21.5 5.76522 21.4477 5.85355 21.3536L12 15.7071L18.1464 21.3536C18.2348 21.4477 18.3674 21.5 18.5 21.5C18.7761 21.5 19 21.2761 19 21V3C19 2.44772 18.5523 2 18 2H6Z" stroke-width="2"/>
                                    </svg>
                                </a>
                                <span class="comment_bookmark-count" id="comment_bookmark-count-${data.id}">${data.bookmarked_by.length}</span>
                            </div>
                            <span class="reply" onclick="commentReply(this)" data-field-id="${postId}" data-id="${data.id}" datatype="commentReplyButton">Ответить</span>
                            ${currentUser == data.username ? `
                            <span class="delete-comment" onclick="commentDelete(this)" id="${data.id}" data-key="${data.id}" data-type="common" data-id="${postId}">Удалить</span>
                        ` : ''}
                        </div>
                        <div class="send_comment__form" id="send_comment__form-${data.id}">
                            <textarea id="comment-${data.id}" class="comment-input" placeholder="Комментарий" id="comment-input-${data.id}"></textarea>
                            <div class="send-comment" id="comment-${data.id}" onclick="sendComment(this)" data-field-id="${data.id}" data-key="${data.id}" data-id="${postId}">Отправить</div>
                        </div>

                    </div>
                `

                const commentsCont = document.querySelector('.comments-container')
                commentsCont.insertAdjacentHTML('beforeend', newComment)
            }
        }
    } catch (error) {
        console.log(error)
    }

}

async function initLoadComments() {
    console.log('start')
    if (!nextCommentsPageUrl || isLoadingComments) return;
    isLoadingComments = true

    const response = await fetch(nextCommentsPageUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    console.log(data)
    nextCommentsPageUrl = data.pages.next

    for (let i = 0; i < data.results.length; i++) {
        const newComment = `
            <div class="profile_comment-item" id="comment-item-${data.results[i].id}">
                <a href="/post/${data.results[i].post_id}" class="post_of_comment">${data.results[i].post}</a>
                <div class="comment-item" id="comment-item-${data.results[i].id}">
                    <div class="comment-head">
                        <img src="${data.results[i].image}" alt="">
                        ${currentProfile == data.results[i].username ? `
                        <div class="username_wrapper">
                            <a href="" style="color: white; font-weight: 500; font-size: 13px;">${data.results[i].username}</a></div>` : `${data.results[i].username}`}
                        <span class="comment_pub-date">только что</span>
                    </div>
                    <div class="comment-content">
                        ${data.results[i].description}
                    </div>
                    <div class="comment-reactions">
                        <div class="comment_like-wrapper" id="wrapper-id" onclick="setCommentLike(this)" data-id="${data.results[i].id}" data-type="common">
                            <img src="/media/icons/hart.png" class="comment_heart-img" id="like-button">
                            <span class="comment_likes-count" id="comment_likes-count-${data.results[i].id}">${data.results[i].likes}</span>
                        </div>
                        <div class="comment_bookmark-wrapper" onclick="setCommentBookmark(this)" data-id="${data.results[i].id}" data-section="bookmarks">
                            <a>
                                <svg class="comment_bookmark-img" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M6 2C5.44772 2 5 2.44772 5 3V21C5 21.2761 5.22386 21.5 5.5 21.5C5.63261 21.5 5.76522 21.4477 5.85355 21.3536L12 15.7071L18.1464 21.3536C18.2348 21.4477 18.3674 21.5 18.5 21.5C18.7761 21.5 19 21.2761 19 21V3C19 2.44772 18.5523 2 18 2H6Z" stroke-width="2"/>
                                </svg>
                            </a>
                            <span class="comment_bookmark-count" id="comment_bookmark-count-${data.results[i].id}">${data.results[i].bookmarked_by.length}</span>
                        </div>
                        ${currentProfile == data.results[i].username ? `
                        <span class="delete-comment" onclick="commentDelete(this)" id="${data.results[i].id}" data-key="${data.results[i].id}" data-type="common" data-id="${data.results[i].post_id}">Удалить</span>
                    ` : ''}
                    </div>
                    <div class="send_comment__form" id="send_comment__form-${data.results[i].id}">
                        <textarea id="comment-${data.results[i].id}" class="comment-input" placeholder="Комментарий" id="reply_comment-input-${data.results[i].id}"></textarea>
                        <div class="reply_send-comment" id="reply_comment-${data.results[i].id}" onclick="SendComment(this)" data-field-id="${data.results[i].id}}" data-key="${data.results[i].id}" data-id="${data.results[i].id}">Отправить</div>
                    </div>
                </div>
            </div>
        `
        postsContainer.insertAdjacentHTML('beforeend', newComment)

    }
    initCommentLikes()
    initCommentBookmarks()
    initCommentLikes()
    initUserFollows();
    isLoadingComments = false
}


async function initLoadPostComments() {
    if (!nextCommentsPageUrl || isLoadingComments) return;
    console.log(nextCommentsPageUrl)
    const moreComments = localStorage.getItem('moreComments')
    isLoadingComments = true

    const response = await fetch(nextCommentsPageUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    console.log(data)
    nextCommentsPageUrl = data.pages.next

    for (let i = 0; i < data.results.length; i++) {
        const newComment = `
            <div class="comment-item" id="comment-item-${data.results[i].id}">
                <div class="comment-head">
                    <img src="${data.results[i].image}" alt="">
                    ${currentUser == data.results[i].username ? `
                    <div class="username_wrapper">
                        <a href="" style="color: white; font-weight: 500; font-size: 13px;">${data.results[i].username}</a></div>` : `${data.results[i].username}`}
                    <span class="comment_pub-date">${smart_time(data.results[i].pub_date)}</span>
                </div>
                <div class="comment-content">
                    ${data.results[i].description}
                </div>
                <div class="comment-reactions">
                    <div class="comment_like-wrapper" id="wrapper-id" onclick="setCommentLike(this)" data-id="${data.results[i].id}" data-type="common">
                        <img src="/media/icons/hart.png" class="comment_heart-img" id="like-button">
                        <span class="comment_likes-count" id="comment_likes-count-${data.results[i].id}">${data.results[i].likes}</span>
                    </div>
                    <div class="comment_bookmark-wrapper" onclick="setCommentBookmark(this)" data-id="${data.results[i].id}" data-section="bookmarks">
                        <a>
                            <svg class="comment_bookmark-img" width="24" height="24" viewBox="0 0 24 24">
                                <path d="M6 2C5.44772 2 5 2.44772 5 3V21C5 21.2761 5.22386 21.5 5.5 21.5C5.63261 21.5 5.76522 21.4477 5.85355 21.3536L12 15.7071L18.1464 21.3536C18.2348 21.4477 18.3674 21.5 18.5 21.5C18.7761 21.5 19 21.2761 19 21V3C19 2.44772 18.5523 2 18 2H6Z" stroke-width="2"/>
                            </svg>
                        </a>
                        <span class="comment_bookmark-count" id="comment_bookmark-count-${data.results[i].id}">${data.results[i].bookmarked_by.length}</span>
                    </div>
                    <span class="reply" onclick="commentReply(this)" data-field-id="${postID}" data-id="${data.results[i].id}" datatype="commentReplyButton">Ответить</span>
                    ${currentUser == data.results[i].username ? `
                    <span class="delete-comment" onclick="commentDelete(this)" id="${data.results[i].id}" data-key="${data.results[i].id}" data-type="common" data-id="${data.results[i].post_id}">Удалить</span>
                ` : ''}
                </div>
                <div class="send_comment__form" id="send_comment__form-${data.results[i].id}">
                    <textarea id="comment-${data.results[i].id}" class="comment-input" placeholder="Комментарий" id="reply_comment-input-${data.results[i].id}"></textarea>
                    <div class="reply_send-comment" id="reply_comment-${data.results[i].id}" onclick="sendComment(this)" data-field-id="${data.results[i].post_id}" data-key="${data.results[i].id}" data-id="${data.results[i].id}">Отправить</div>
                </div>
            </div>
        `
        commentsContainer.insertAdjacentHTML('beforeend', newComment)

    }

    if (data.count - data.results.length > 0 && moreComments === 'false') {
        moreCommentsButton = `<div class="hidden-comments__button" onclick="moreCommentsFunc()" >
                                        <span>Показать ${data.count - data.results.length} ${smart_word_end(data.count - data.results.length)}</span>
                                    </div>`
        commentsContainer.insertAdjacentHTML('beforeend', moreCommentsButton)
    }

    initCommentLikes()
    initCommentBookmarks()
    initCommentLikes()
    initUserFollows();
    isLoadingComments = false



}

function moreCommentsFunc() {
    localStorage.setItem('moreComments', true)
    moreCommentsClass = document.querySelector('.hidden-comments__button')
    moreCommentsClass.style.display = 'none'

}

async function initCommentLikes() {
    const status = await window.checkToken(false)

    const imgWrapper = document.querySelectorAll(".comment_like-wrapper");
    const BASE_URL = window.location.origin

    if (status) {
        for (const img of imgWrapper) {
            const id = img.getAttribute("data-id");
            const type = img.getAttribute('data-type')
            const likesCount = document.getElementById(`comment_likes-count-${id}`);

            try {
                const response = await fetch(`${BASE_URL}/frontend_api/v1/comments/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();

                if (data.is_authenticated) {
                    if (data.liked) {
                        img.classList.replace("comment_like-wrapper", "comment_like-wrapper-liked")
                    } else {
                        img.classList.replace("comment_like-wrapper-liked", "comment_like-wrapper")
                    }
                } else {
                    img.classList.replace("comment_like-wrapper-liked", "comment_like-wrapper")
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}

async function profileCommentsFunc() {
    const commentButton = document.getElementById('profile-nav__item_5')
    const user = commentButton.getAttribute('data-id')
    const BASE_URL = window.location.origin
    const currentUser = commentButton.getAttribute('data-auth')
    const profileHeaderNavCont = document.querySelector('.profile-header-nav-cont')

    profileHeaderNavCont.innerHTML = ''

    nextCommentsPageUrl = `${BASE_URL}/frontend_api/v1/comments/get_user_comments/${user}`
    isLoadingComments = false;
    isLoadingPosts = true;
    localStorage.setItem('isSearchMode', 'false')
    postsContainer = profileHeaderNavCont

    const oldComments = document.querySelectorAll('.comment-item')

    if (oldComments) {
        oldComments.forEach(comment => comment.remove())
    }
    profileHeaderNavCont.innerHTML = ''

    initLoadComments()
}

function initLoadCommentForm() {
    document.querySelectorAll(`.send_comment__form`).forEach(el => {
        if (el.id === `send_comment__form-${postID}`) {
            el.style.display = 'flex'
        }
    })
}

async function commentReply(span) {
    const replyCount = span.getAttribute('datatype')
    let textContent_1 = 'Ответить'
    let textContent_2 = 'Отмена'
    const postId = span.getAttribute('data-field-id')
    const commentId = span.getAttribute('data-id')
    let commentWrapper = ''
    document.querySelectorAll(`.send_comment__form`).forEach(el => {
        if (el.id === `send_comment__form-${commentId}`) {
            el.style.display = 'flex'
            commentWrapper = el

        } else {
            el.style.display = 'none'
            span.textContent = textContent_1
        }

    })


    if (span.classList.contains('deployed')) {
        document.querySelectorAll(`.send_comment__form`).forEach(el => {
            if (el.id === `send_comment__form-${postId}`) {
                el.style.display = 'flex'
            } else {
                el.style.display = 'none'
            }
        })

        commentWrapper.style.display = 'none'
        span.textContent = textContent_1
        span.classList.add('hidden')
        span.classList.remove('deployed')

    } else {
        document.querySelectorAll(`span[datatype="${span.getAttribute('datatype')}"]`).forEach(el => {
            if (el.textContent === textContent_2) {
                el.textContent = textContent_1
            }
        })

        span.classList.add('deployed')
        span.textContent = textContent_2
        span.classList.add('hidden')
        commentWrapper.style.display = 'flex'
    }
}



async function commentDelete(span) {
    const type = span.getAttribute('data-type')
    const postId = span.getAttribute('data-id')
    const id = span.getAttribute('data-key')
    let commentsCont = document.querySelector('.comments-container')
    const status = await window.checkToken()
    const BASE_URL = window.location.origin

    if (status) {
        const request = await fetch(`${BASE_URL}/frontend_api/v1/comments/${id}/`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': window.csrfToken,
            },
            body: JSON.stringify({
                'pk': id
            })
        })
        console.log('commentsCont', commentsCont)
        if (!commentsCont) {
            console.log('not defined')
            commentsCont = document.querySelector('.profile-header-nav-cont')
        }
        console.log(commentsCont, '22')
        if (request.status === 204) {
            console.log(204)
            console.log(commentsCont)
            const successMessage = document.createElement('div')
            successMessage.innerText = 'Комментарий удален'
            successMessage.style.color = 'var(--main-color)'
            const delComment = document.getElementById(`comment-item-${id}`)
            console.log(delComment)
            commentsCont.replaceChild(successMessage, delComment)
        }
    }
}


async function setCommentLike(div) {
	const id = div.getAttribute("data-id");
	let likesCount = ''
	const commentType = div.getAttribute("data-type")

    likesCount = document.getElementById(`comment_likes-count-${id}`);

	const status = await window.checkToken()

	const BASE_URL = window.location.origin


	try {
	    if (status) {
            const request = await fetch(`${BASE_URL}/frontend_api/v1/comments/${id}/set_like/`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const data = await request.json()

            likesCount.textContent = data.likes;

            let before = ''
            if (commentType === 'reply') {before = 'reply-'}
            if (data.liked) {
                div.classList.replace(`${before}comment_like-wrapper`, `${before}comment_like-wrapper-liked`)
                likesCount.classList.remove('setlikeanimate', 'dellikeanimate')
                void likesCount.offsetWidth
                likesCount.classList.add('dellikeanimate');
            } else {
                div.classList.replace(`${before}comment_like-wrapper-liked`, `${before}comment_like-wrapper`)
                likesCount.classList.remove('setlikeanimate', 'dellikeanimate')
                void likesCount.offsetWidth
                likesCount.classList.add('setlikeanimate');
            }
	    }

	} catch (error) {
        console.log(error);
    }
}


async function initCommentLikes() {
    const status = await window.checkToken(false)

    const imgWrapper = document.querySelectorAll(".comment_like-wrapper");
    const replyWrapper = document.querySelectorAll(".reply-comment_like-wrapper")
    const BASE_URL = window.location.origin

    if (status) {
        for (const img of imgWrapper) {
            const id = img.getAttribute("data-id");
            const type = img.getAttribute('data-type')
            const likesCount = document.getElementById(`comment_likes-count-${id}`);

            try {
                const response = await fetch(`${BASE_URL}/frontend_api/v1/comments/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();

                if (data.is_authenticated) {
                    if (data.liked) {
                        img.classList.replace("comment_like-wrapper", "comment_like-wrapper-liked")
                        likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                        void likesCount.offsetWidth; // Принудительная перерисовка
                        likesCount.classList.add('dellikeanimate');
                    } else {
                        img.classList.replace("comment_like-wrapper-liked", "comment_like-wrapper")
                        likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                        void likesCount.offsetWidth; // Принудительная перерисовка
                        likesCount.classList.add('setlikeanimate');
                    }
                } else {
                    img.classList.replace("comment_like-wrapper-liked", "comment_like-wrapper")
                    likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                    void likesCount.offsetWidth; // Принудительная перерисовка
                    likesCount.classList.add('setlikeanimate');
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}