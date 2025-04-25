async function sendComment() {
	const comment = document.querySelector('.comment-input')
	console.log(comment.value)
	console.log(postID)

	const request = await fetch(`http://127.0.0.1:8000/api/add_comment/${postID}/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
		},
		body: JSON.stringify({
			'comment':comment.value,
		})
	})

	const data = await request.json()
	console.log(data)

	const newComment = `
		<div class="comment-item">
			<div class="comment-head">
				<img src="${data.image}" alt="">
				<a href="">${data.username}</a>
				<span class="comment_pub-date">только что</span>
			</div>
			<div class="comment-content">
				${data.description}
			</div>
			<div class="comment-reactions">
				<div class="comment_like-wrapper" id="wrapper-id" onclick="setCommentLike(this)" data-id="${data.id}">
					<img src="/media/icons/hart.png" class="comment_heart-img" id="like-button">
					<span class="comment_likes-count" id="comment_likes-count-${data.id}">${data.likes}</span>
				</div>
				<span class="reply">Ответить</span>
			</div>
		</div>
	`

	const commentsCont = document.querySelector('.comments')
	commentsCont.insertAdjacentHTML('beforeend', newComment)

}


async function setCommentLike(div) {

	const id = div.getAttribute("data-id");
	console.log('id:', id)
	const likesCount = document.getElementById(`comment_likes-count-${id}`);

	console.log(id)

	try {
	console.log('Begin')
		const request = await fetch(`http://127.0.0.1:8000/api/post/${postID}/comment/${id}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({})
        })

		const data = await request.json()
		console.log(`data.likes: ${data.likes}`)
		document.getElementById(`comment_likes-count-${id}`).textContent = data.likes;

		if (data.liked) {
		    console.log('data liked')
            div.classList.replace("comment_like-wrapper", "comment_like-wrapper-liked")
            likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
            void likesCount.offsetWidth; // Принудительная перерисовка
            likesCount.classList.add('dellikeanimate');
        } else {
            console.log('data liked else')
            div.classList.replace("comment_like-wrapper-liked", "comment_like-wrapper")
            likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
            void likesCount.offsetWidth; // Принудительная перерисовка
            likesCount.classList.add('setlikeanimate');
        }
	} catch (error) {
        console.log(document.getElementById(`comment_likes-count-${id}`));
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    console.log(1)
    // Убедимся, что весь HTML загружен и есть элементы с классом .heart-img
    const imgWrapper = document.querySelectorAll(".comment_like-wrapper");

    for (const img of imgWrapper) {
        const id = img.getAttribute("data-id");
        const likesCount = document.getElementById(`comment_likes-count-${id}`);

        try {
            // Запрос к серверу
            console.log('request')
            const response = await fetch(`http://127.0.0.1:8000/api/post/${postID}/comment/${id}/`);
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
})


async function commentReply(div) {

    const id = div.getAttribute('data-id')
    const commentWrapper = document.getElementById(`reply_id-${id}`)

    if (div.classList.contains('deployed')) {
        commentWrapper.style.display = 'none'
        div.classList.add('hidden')
        div.classList.remove('deployed')
    } else {
        div.classList.add('deployed')
        div.classList.add('hidden')
        commentWrapper.style.display = 'flex'
    }
}
