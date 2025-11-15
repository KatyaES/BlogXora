

async function searchPosts() {
    const BASE_URL = window.location.origin
    const query = document.querySelector('.site-header__input-search').value
    localStorage.setItem('isSearchMode', 'true')

    if (lastQuery !== query) {
        const params = new URLSearchParams(window.location.search)
        params.set('query', query)
        nextPostsPageUrl = `${BASE_URL}/frontend_api/v1/search/?${params.toString()}`
        lastQuery = query

        const oldPosts = document.querySelectorAll('.post-wrapper')

        if (oldPosts) {
            oldPosts.forEach(post => post.remove())
        }
    }

    isLoading = false

    if (!nextPostsPageUrl || isLoadingPosts) return;
    isLoadingPosts = true

    const response = await fetch(nextPostsPageUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    nextPostsPageUrl = data.pages.next

    const postsContainer = document.querySelector('.posts-container')

    console.log(data)
    const badImg = document.querySelector('.bad-search-img')
    if (data.results.length === 0) {
        badImg.style.display = 'flex'
    } else {
        badImg.style.display = 'none'
        for (let i = 0; i < data.results.length; i++) {
            if (document.getElementById(`post-${data.results[i].id}`)) continue;
                const posts = `
                <div class="post-wrapper" id="post-${data.results[i].id}">
                    <div class="posts">
                        <div class="user-photo-name">
                            <div class="user">
                                <img src="${data.results[i].image}">
                                    <div class="name-and-date-category">
                                        <div class="username">
                                            <a href="${window.BASE_URL}/users/${data.results[i].user}">${data.results[i].user}</a>
                                            <span style="color: gray;">${smart_time(data.results[i].pub_date)}</span>
                                        </div>
                                    </div>
                                </div>
                                ${currentUser !== data.results[i].user
                                    ? `<div class="follow-btn" onclick="userFollows(this)" data-id="${data.results[i].user_id}" datatype="${currentUser}">Подписаться</div>`
                                    : ''
                                }
                            </div>
                        <br>
                            <div class="post-meta">
                                <a href="${BASE_URL}/${data.results[i].tag}" class="post_category">${data.results[i].category}</a>
                                <div class="post-type">${data.results[i].post_type}</div>
                            </div>
                        <br>
                        <br>
                        <div class="title">
                            <a href="/post/${data.results[i].id}">${data.results[i].title}</a>
                        </div>
                        <br>
                        <div class="ql-editor">
                            ${data.results[i].wrapp_img
                                ? `<img src="${data.results[i].wrapp_img}" alt="">`
                                : ''
                            }
                            <p>${splitContent(data.results[i].content)}</p>
                        </div>
                        <div class="detail-button">
                            <a href="/post/${data.results[i].id}/">Читать далее</a>
                        </div>
                        <div class="icon-cont">
                            <div class="post-reactions">
                                <div class="like-wrapper" id="wrapper-id" onclick="setPostLike(this)" data-id="${data.results[i].id}">
                                    <img src="/media/icons/hart.png" class="heart-img" id="like-button">
                                    <span class="likes-count" id="likes-count-${data.results[i].id}">${data.results[i].liked_by.length}</span>
                                </div>
                                <div class="comment-wrapper">
                                    <img src="/media/icons/comment.svg" class="comment-img" onclick="window.location.href = '/post/${data.results[i].id}/'">
                                    <span class="comment-count">${data.results[i].comment_count}</span>
                                </div>
                                <div class="bookmark-wrapper" onclick="setPostBookmark(this)" data-id="${data.results[i].id}" data-section="bookmarks">
                                    <a>
                                        <svg class="bookmark-img" width="24" height="24" viewBox="0 0 24 24">
                                            <path d="M6 2C5.44772 2 5 2.44772 5 3V21C5 21.2761 5.22386 21.5 5.5 21.5C5.63261 21.5 5.76522 21.4477 5.85355 21.3536L12 15.7071L18.1464 21.3536C18.2348 21.4477 18.3674 21.5 18.5 21.5C18.7761 21.5 19 21.2761 19 21V3C19 2.44772 18.5523 2 18 2H6Z" stroke-width="2"/>
                                        </svg>
                                    </a>
                                    <span class="bookmark-count" id="bookmark-count-${data.results[i].id}">${data.results[i].bookmark_user.length}</span>
                                </div>
                            </div>
                            <div class="view-wrapper">
                                <img src="/media/icons/view.svg" class="views-img">
                                <span class="views-count">${data.results[i].views_count}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `
            postsContainer.insertAdjacentHTML('beforeend', posts)
        }
    }
    initPostBookmarks()
    initPostLikes()
    initUserFollows()
    isLoadingPosts = false
    localStorage.setItem('isSearchMode', true)
}








