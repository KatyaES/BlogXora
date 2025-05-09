import likesUpdate from './domloaded.js';

window.searchPosts = searchPosts;


function smart_time(date) {
    const result = Date.now() - new Date(date).getTime()
    const seconds = Math.floor(result / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(seconds / 3600)
    const days = Math.floor( hours / 24)


    if (days > 0) {
        return new Date(date).toLocaleString('ru-Ru', {
            day: 'numeric',
            month: 'long',
        })
    }

    if (hours > 0) {
        return `${hours} ч назад`
    } else {
        if (minutes < 1) {
            return `${seconds} с назад`
        } else {
            return `${minutes} мин назад`
        }
    }
}

async function searchPosts() {
    const post = document.querySelector('.search-input').value

    const request = await fetch(`http://127.0.0.1:8000/api/search/posts/?query=${post}`, {
        method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		}
    })

    const data = await request.json()
    console.log(data.length)

    const postsContainer = document.querySelector('.full-search-wrapper')

    const oldPosts = document.querySelectorAll('.post-wrapper')

    if (oldPosts) {
        oldPosts.forEach(post => post.remove())
    }
    const badImg = document.querySelector('.bad-search-img')

    if (data.length === 0) {
        badImg.style.display = 'flex'
    } else {
        badImg.style.display = 'none'
        for (let i = 0; i < data.length; i++) {
            const posts = `
                <div class="post-wrapper">
                    <div class="posts">
                        <div class="user-photo-name">
                            <div class="user">
                                <img src="${data[i].image}">
                                    <div class="name-and-date-category">
                                        <div class="username">
                                            <a href="#">${data[i].user}</a>
                                        </div>
                                        <div class="category-and-date">
                                            <a href="#">#${data[i].category}</a>
                                            <span style="color: gray;">${smart_time(data[i].pub_date)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <br>
                        <div class="title">
                            <a href="{% url 'post_detail' ${data[i].id} %}#top">${data[i].title}</a>
                        </div>
                        <br>
                        <div class="ql-editor">
                            <img src="${data[i].wrapp_img}" alt="">
                            <p>${data[i].content}</p>
                        </div>
                        <div class="detail-button">
                            <a href="{% url 'post_detail' ${data[i].id} %}#top">Читать далее</a>
                        </div>
                        <div class="icon-cont">
                            <div class="post-reactions">
                                <div class="like-wrapper" id="wrapper-id" onclick="func(this)" data-id="${data[i].id}">
                                    <img src="/media/icons/hart.png" class="heart-img" id="like-button">
                                    <span class="likes-count" id="likes-count-${data[i].id}">${data[i].liked_by.length}</span>
                                </div>
                                <div class="comment-wrapper">
                                    <a href="{% url 'post_detail' ${data[i].id} %}">
                                        <img src="/media/icons/comment.svg" class="comment-img">
                                    </a>
                                    <span class="comment-count">${data[i].comment_count}</span>
                                </div>
                                <div class="bookmark-wrapper">
                                    <a>
                                        <img src="/media/icons/bookmark.svg" class="bookmark-img">
                                    </a>
                                    <span class="bookmark-count">0</span>
                                </div>
                            </div>
                            <div class="view-wrapper">
                                <img src="/media/icons/view.svg" class="views-img">
                                <span class="views-count">${data[i].views_count}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `
            postsContainer.insertAdjacentHTML('beforeend', posts)

        }
    }
    likesUpdate()
}

