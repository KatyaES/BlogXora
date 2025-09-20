async function sendComment(div) {
	const comment = document.querySelector('.comment-input')
	const postId = div.getAttribute('data-id')

	const status = await window.checkToken()
    const BASE_URL = window.location.origin

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
                        <span class="reply" onclick="commentReply(this)" data-id="${data.id}">Ответить</span>
                        ${currentUser == data.username ? `
                        <span class="delete-comment" onclick="commentDelete(this)" id="${data.id}" data-key="${data.id}" data-type="common" data-id="${postId}">Удалить</span>
                    ` : ''}
                    </div>
                    <div class="reply_comment-wrapper" id="reply_comment-wrapper-${data.id}">
                        <textarea class="reply_comment-input" placeholder="Комментарий" id="reply_comment-input-${data.id}"></textarea>
                        <div class="reply_send-comment" id="reply_comment-${data.id}" onclick="replySendComment(this)" data-field-id="${postId}" data-key="${data.id}" data-id="${data.id}">Отправить</div>
                    </div>

                </div>
            `

            const commentsCont = document.querySelector('.comments')
            commentsCont.insertAdjacentHTML('beforeend', newComment)
        }
    }
}



document.addEventListener('DOMContentLoaded', async () => {
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
        //reply below
        for (const img of replyWrapper) {
            const id = img.getAttribute("data-id");
            const type = img.getAttribute('data-type')
            const likesCount = document.getElementById(`reply_comment_likes-count-${id}`);

            try {
                if (status) {
                    const response = await fetch(`${BASE_URL}/frontend_api/v1/reply_comments/${id}`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    const data = await response.json();

                    if (data.is_authenticated) {
                        if (data.liked) {
                            img.classList.replace("reply-comment_like-wrapper", "reply-comment_like-wrapper-liked")
                            likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                            void likesCount.offsetWidth; // Принудительная перерисовка
                            likesCount.classList.add('dellikeanimate');
                        } else {
                            img.classList.replace("reply-comment_like-wrapper-liked", "reply-comment_like-wrapper")
                            likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                            void likesCount.offsetWidth; // Принудительная перерисовка
                            likesCount.classList.add('setlikeanimate');
                        }
                    } else {
                        img.classList.replace("reply-comment_like-wrapper-liked", "reply-comment_like-wrapper")
                        likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                        void likesCount.offsetWidth; // Принудительная перерисовка
                        likesCount.classList.add('setlikeanimate');
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
})


async function commentReply(span) {

    const id = span.getAttribute('data-id')
    const replyCount = span.getAttribute('datatype')
    const commentWrapper = document.getElementById(`reply_comment-wrapper-${id}`)
    let textContent_1 = 'Ответить'
    let textContent_2 = 'Скрыть'

    if (span.classList[0] === 'reply') { textContent_1 = 'Ответить'; textContent_2 = 'Скрыть' } else {
        textContent_1 = `показать ответы (${replyCount})`; textContent_2 = `скрыть ответы (${replyCount})`
    }


    if (span.classList.contains('deployed')) {
        commentWrapper.style.display = 'none'
        span.textContent = textContent_1
        span.classList.add('hidden')
        span.classList.remove('deployed')
    } else {
        span.classList.add('deployed')
        span.textContent = textContent_2
        span.classList.add('hidden')
        commentWrapper.style.display = 'flex'
    }
}


async function replySendComment(div) {
    const postId = div.getAttribute('data-field-id')
    const status = await window.checkToken()
    const id = div.getAttribute('data-id')
    const commentId = div.getAttribute('data-key')
    const comment = document.getElementById(`reply_comment-input-${commentId}`)
    const BASE_URL = window.location.origin

    if (comment.value) {
        if (status) {
            const request = await fetch(`${BASE_URL}/frontend_api/v1/reply_comments/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': window.csrfToken,
                },
                body: JSON.stringify({
                    'comment':comment.value,
                    'id':id,
                })
            })

            const data = await request.json()
            const commentCont = document.getElementById(`reply_comment-wrapper-${id}`)

            const newComment = `
                <div class="reply_comment-item" id="comment-item-${data.id}">
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
                        <div class="reply-comment_like-wrapper" id="wrapper-id" onclick="setCommentLike(this)" data-id="${data.id}" data-type="reply">
                            <img src="/media/icons/hart.png" class="comment_heart-img" id="like-button">
                            <span class="comment_likes-count" id="reply_comment_likes-count-${data.id}">${data.likes}</span>
                        </div>
                        <span class="reply" onclick="commentReply(this)" data-id="${data.id}">Ответить</span>
                        ${currentUser == data.username ? `
                        <span class="delete-comment" onclick="ReplyCommentDelete(this)" data-field-id="${commentId}" id="${data.id}" data-key="${data.id}" data-type="reply" data-id="${postId}">Удалить</span>
                    ` : ''}
                    </div>
                    <div class="reply_comment-wrapper" id="reply_comment-wrapper-${data.id}">
                        <textarea class="reply_comment-input" placeholder="Комментарий" id="reply_comment-input-${data.id}"></textarea>
                        <div class="reply_send-comment" onclick="replySendComment(this)" data-field-id="${postId}" data-key="${commentId}" data-id="${id}">Отправить</div>
                    </div>
                </div>
            `

            commentCont.insertAdjacentHTML('beforeend', newComment)

        }
    }
}


async function commentDelete(span) {
    const type = span.getAttribute('data-type')
    const postId = span.getAttribute('data-id')
    const id = span.getAttribute('data-key')
    let commentsCont = document.querySelector('.comments')
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

        if (type === 'reply') {
            commentsCont = document.getElementById(`reply_comment-wrapper-${commentId}`)
        } else {
            commentsCont = document.querySelector('.comments')
            if (!commentsCont) {
                console.log('not defined')
                commentsCont = document.querySelector('.profile-header-nav-cont')
            }
        }
        if (request.status === 204) {
            console.log(204)
            const successMessage = document.createElement('div')
            successMessage.innerText = 'Комментарий удален'
            successMessage.style.color = 'var(--main-color)'
            const delComment = document.getElementById(`comment-item-${id}`)
            commentsCont.replaceChild(successMessage, delComment)
        }
    }
}


async function ReplyCommentDelete(span) {
    const commentId = span.getAttribute('data-field-id')
    const type = span.getAttribute('data-type')
    const postId = span.getAttribute('data-id')
    const id = span.getAttribute('data-key')
    let commentsCont = document.querySelector('.comments')
    const status = await window.checkToken()
    const BASE_URL = window.location.origin


    if (status) {
        const request = await fetch(`${BASE_URL}/frontend_api/v1/reply_comments/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': window.csrfToken,
            },
            body: JSON.stringify({
                'parent_pk': commentId
            })
        })

        if (type === 'reply') {
            commentsCont = document.getElementById(`reply_comment-wrapper-${commentId}`)
        } else {
            commentsCont = document.querySelector('.comments')
        }
        if (request.status === 204) {
            const successMessage = document.createElement('div')
            successMessage.innerText = 'Комментарий удален'
            successMessage.style.color = 'var(--main-color)'
            const delComment = document.getElementById(`comment-item-${id}`)
            commentsCont.replaceChild(successMessage, delComment)
        }
    }
}


