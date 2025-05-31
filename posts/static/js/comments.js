async function sendComment(div) {
	const comment = document.querySelector('.comment-input')
	const postId = div.getAttribute('data-id')

	console.log(comment.value)
	console.log(postID)

	const token = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')
    console.log(token)

    if (token) {
        const request = await fetch(`http://127.0.0.1:8000/api/comments/${postID}/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
			'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
		},
		body: JSON.stringify({
			'comment':comment.value,
		})
        })

        const data = await request.json()
        console.log(data)
        console.log(data.id)

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
    } else {alert('Что бы оставить комментарий нужно войти в аккаунт')}
}


async function setCommentLike(div) {
	const id = div.getAttribute("data-id");
	console.log('id:', id)
	let likesCount = ''
	const commentType = div.getAttribute("data-type")

    if (commentType === 'common') {
        likesCount = document.getElementById(`comment_likes-count-${id}`);
    } else {
        likesCount = document.getElementById(`reply_comment_likes-count-${id}`);
    }

	const token = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')

	console.log(commentType)
	console.log('likesCount::', likesCount)
	console.log('const postID: ', postID)

	try {
	    if (token) {
	        console.log('Begin')
            const request = await fetch(`http://127.0.0.1:8000/api/comments/${postID}/${id}/like/?type=${commentType}`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({})
            })

            const data = await request.json()
            console.log(`data.likes: ${data.likes}`)

            likesCount.textContent = data.likes;

            let before = ''
            if (commentType === 'reply') {before = 'reply-'}
            if (data.liked) {
                console.log('data liked')
                div.classList.replace(`${before}comment_like-wrapper`, `${before}comment_like-wrapper-liked`)
                likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                void likesCount.offsetWidth; // Принудительная перерисовка
                likesCount.classList.add('dellikeanimate');
            } else {
                console.log('data liked else')
                div.classList.replace(`${before}comment_like-wrapper-liked`, `${before}comment_like-wrapper`)
                likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                void likesCount.offsetWidth; // Принудительная перерисовка
                likesCount.classList.add('setlikeanimate');
            }
	    } else { alert('Для этого действия нужно авторизоваться')}

	} catch (error) {
        console.log(error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log(1)
    const token = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')

    // Убедимся, что весь HTML загружен и есть элементы с классом .heart-img
    const imgWrapper = document.querySelectorAll(".comment_like-wrapper");
    const replyWrapper = document.querySelectorAll(".reply-comment_like-wrapper")

    for (const img of imgWrapper) {
        const id = img.getAttribute("data-id");
        const type = img.getAttribute('data-type')
        const likesCount = document.getElementById(`comment_likes-count-${id}`);


        try {
            // Запрос к серверу
            console.log('request')
            const response = await fetch(`http://127.0.0.1:8000/api/comments/${postID}/${id}/like/?type=${type}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data)

            // Печатаем, что вернул сервер
            // Проверяем, авторизован ли пользователь
            if (data.is_authenticated) {
                if (data.liked) {
                    console.log('if')
                    img.classList.replace("comment_like-wrapper", "comment_like-wrapper-liked")
                    likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                    void likesCount.offsetWidth; // Принудительная перерисовка
                    likesCount.classList.add('dellikeanimate');
                } else {
                    console.log(' else')
                    img.classList.replace("comment_like-wrapper-liked", "comment_like-wrapper")
                    likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                    void likesCount.offsetWidth; // Принудительная перерисовка
                    likesCount.classList.add('setlikeanimate');
                }
            } else {
                console.log('else 2')
                img.classList.replace("comment_like-wrapper-liked", "comment_like-wrapper")
                likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                void likesCount.offsetWidth; // Принудительная перерисовка
                likesCount.classList.add('setlikeanimate');
            }
        } catch (error) {
            console.error("Ошибка при запросе для id " + id + ":", error);
        }
    }
    //reply below
    for (const img of replyWrapper) {
        const token = localStorage.getItem('access')
        const refresh = localStorage.getItem('refresh')

        const id = img.getAttribute("data-id");
        const type = img.getAttribute('data-type')
        const likesCount = document.getElementById(`reply_comment_likes-count-${id}`);

        try {
            // Запрос к серверу
            console.log('request')
            const response = await fetch(`http://127.0.0.1:8000/api/comments/${postID}/${id}/like/?type=${type}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data)

            // Печатаем, что вернул сервер
            // Проверяем, авторизован ли пользователь
            if (data.is_authenticated) {
                if (data.liked) {
                    console.log('if')
                    img.classList.replace("reply-comment_like-wrapper", "reply-comment_like-wrapper-liked")
                    likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                    void likesCount.offsetWidth; // Принудительная перерисовка
                    likesCount.classList.add('dellikeanimate');
                } else {
                    console.log(' else')
                    img.classList.replace("reply-comment_like-wrapper-liked", "reply-comment_like-wrapper")
                    likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                    void likesCount.offsetWidth; // Принудительная перерисовка
                    likesCount.classList.add('setlikeanimate');
                }
            } else {
                console.log('else 2')
                img.classList.replace("reply-comment_like-wrapper-liked", "reply-comment_like-wrapper")
                likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                void likesCount.offsetWidth; // Принудительная перерисовка
                likesCount.classList.add('setlikeanimate');
            }
        } catch (error) {
            console.error("Ошибка при запросе для id " + id + ":", error);
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
    console.log('post id: ', postId)
    const token = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')
    const id = div.getAttribute('data-id')
    const commentId = div.getAttribute('data-key')
    const comment = document.getElementById(`reply_comment-input-${commentId}`)
    console.log('comment: ', comment, commentId)

    if (token) {
        const request = await fetch(`http://127.0.0.1:8000/api/reply-comments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                'comment':comment.value,
                'id':id,
            })
	    })

        const data = await request.json()
        const commentCont = document.getElementById(`reply_comment-wrapper-${id}`)
        console.log(data)

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
                    <span class="delete-comment" onclick="commentDelete(this)" data-field-id="${commentId}" id="${data.id}" data-key="${data.id}" data-type="reply" data-id="${postId}">Удалить</span>
                ` : ''}
                </div>
                <div class="reply_comment-wrapper" id="reply_comment-wrapper-${data.id}">
                    <textarea class="reply_comment-input" placeholder="Комментарий" id="reply_comment-input-${data.id}"></textarea>
                    <div class="reply_send-comment" onclick="replySendComment(this)" data-field-id="${postId}" data-key="${commentId}" data-id="${id}">Отправить</div>
                </div>
            </div>
        `

        commentCont.insertAdjacentHTML('beforeend', newComment)

    } else {alert('Что бы оставить комментарий войдите в акканут')}
}


async function commentDelete(span) {
    const commentId = span.getAttribute('data-field-id')
    const type = span.getAttribute('data-type')
    const postId = span.getAttribute('data-id')
    const id = span.getAttribute('data-key')
    console.log('id::', id)
    console.log('postId: ', postId)
    console.log('span: ', span)
    let commentsCont = document.querySelector('.comments')
    const token = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')
    console.log('token: ', token)
    console.log('token refresh: ', refresh)
    console.log('comment id::', commentId)

    const request = await fetch(`http://127.0.0.1:8000/api/comments/${id}/${postId}/delete/?type=${type}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (type === 'reply') { commentsCont = document.getElementById(`reply_comment-wrapper-${commentId}`)
    } else { commentsCont = document.querySelector('.comments') }
    if (request.status === 204) {
        console.log(204)
        const successMessage = document.createElement('div')
        successMessage.innerText = 'Комментарий удален'
        successMessage.style.color = 'var(--main-color)'
        const delComment = document.getElementById(`comment-item-${id}`)
        console.log('del comment: ', delComment, id)
        commentsCont.replaceChild(successMessage, delComment)

    } else { console.log('error in delete process') }
}

