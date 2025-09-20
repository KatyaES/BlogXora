async function likesUpdate() {
    const status = await window.checkToken()
    const imgWrapper = document.querySelectorAll(".like-wrapper");
    const BASE_URL = window.location.origin

    if (status) {
        for (const img of imgWrapper) {
            const id = img.getAttribute("data-id");
            const likesCount = document.getElementById(`likes-count-${id}`);
            const response = await fetch(`${BASE_URL}/frontend_api/v1/posts/${id}/`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    }
                });
            const data = await response.json();
            if (data.is_authenticated) {
                if (data.liked) {
                    img.classList.replace("like-wrapper", "like-wrapper-liked")
                    likesCount.classList.remove('setlikeanimate', 'dellikeanimate');
                    void likesCount.offsetWidth
                    likesCount.classList.add('dellikeanimate');
                } else {
                    img.classList.replace("like-wrapper-liked", "like-wrapper")
                    likesCount.classList.remove('setlikeanimate', 'dellikeanimate');
                    void likesCount.offsetWidth
                    likesCount.classList.add('setlikeanimate');
                }
            } else {
                img.classList.replace("like-wrapper-liked", "like-wrapper")
                likesCount.classList.remove('setlikeanimate', 'dellikeanimate');
                void likesCount.offsetWidth;
                likesCount.classList.add('setlikeanimate');
            }
        }
    }
}

async function bookmarksUpdate() {
    const BASE_URL = window.location.origin

    const bookmarkWrapper = document.querySelectorAll(".bookmark-wrapper");
    const status = window.checkToken(true)

    for (const img of bookmarkWrapper) {
        const id = img.getAttribute("data-id");
        const bookmarkCount = document.getElementById(`bookmark-count-${id}`);

        try {
            if (status) {
                const response = await fetch(`${BASE_URL}/frontend_api/v1/posts/${id}/`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        }
                    });
                const data = await response.json();

                if (data.is_authenticated) {
                    if (data.set_bookmark) {
                        img.classList.replace("bookmark-wrapper", "bookmark-wrapper-set")
                        bookmarkCount.classList.remove('setlikeanimate', 'dellikeanimate')
                        void bookmarkCount.offsetWidth
                        bookmarkCount.classList.add('dellikeanimate');
                    } else {
                        img.classList.replace("bookmark-wrapper-set", "bookmark-wrapper")
                        bookmarkCount.classList.remove('setlikeanimate', 'dellikeanimate')
                        void bookmarkCount.offsetWidth;
                        bookmarkCount.classList.add('setlikeanimate');
                    }
                } else {
                    img.classList.replace("bookmark-wrapper-et", "bookmark-wrapper")
                    bookmarkCount.classList.remove('setlikeanimate', 'dellikeanimate')
                    void bookmarkCount.offsetWidth;
                    bookmarkCount.classList.add('setlikeanimate');
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
}

async function commentBookmarksUpdate() {
    const BASE_URL = window.location.origin

    const bookmarkWrapper = document.querySelectorAll(".comment_bookmark-wrapper");
    const status = window.checkToken(true)

    for (const img of bookmarkWrapper) {
        const comment_id = img.getAttribute("data-id");
        const bookmarkCount = document.getElementById(`comment_bookmark-count-${comment_id}`);

        try {
            if (status) {
                const response = await fetch(`${BASE_URL}/frontend_api/v1/comments/${comment_id}/`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': window.csrfToken,
                        }
                    });
                const data = await response.json();
                console.log(data)

                if (data.is_authenticated) {
                    if (data.set_bookmark) {
                        img.classList.replace("comment_bookmark-wrapper", "comment_bookmark-wrapper-set")
                        bookmarkCount.classList.remove('setlikeanimate', 'dellikeanimate')
                        void bookmarkCount.offsetWidth
                        bookmarkCount.classList.add('dellikeanimate');
                    } else {
                        img.classList.replace("comment_bookmark-wrapper-set", "comment_bookmark-wrapper")
                        bookmarkCount.classList.remove('setlikeanimate', 'dellikeanimate')
                        void bookmarkCount.offsetWidth;
                        bookmarkCount.classList.add('setlikeanimate');
                    }
                } else {
                    img.classList.replace("comment_bookmark-wrapper-et", "comment_bookmark-wrapper")
                    bookmarkCount.classList.remove('setlikeanimate', 'dellikeanimate')
                    void bookmarkCount.offsetWidth;
                    bookmarkCount.classList.add('setlikeanimate');
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
}

window.setCommentLike = async function(div) {
	const id = div.getAttribute("data-id");
	let likesCount = ''
	const commentType = div.getAttribute("data-type")

    if (commentType === 'common') {
        likesCount = document.getElementById(`comment_likes-count-${id}`);
    } else {
        likesCount = document.getElementById(`reply_comment_likes-count-${id}`);
    }

	const status = await window.checkToken()

	const BASE_URL = window.location.origin


	try {
	    if (status) {
            const request = await fetch(`${BASE_URL}/frontend_api/v1/comments/${id}/set_like/?type=${commentType}`, {
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

async function commentLikedUpdate() {
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
}

async function domFollowFunc() {
    const followBtn = document.querySelectorAll('.follow-btn')

    const status = await window.checkToken(false)
    const BASE_URL = window.location.origin

    if (status) {
        for (const btn of followBtn) {
            const userId = btn.getAttribute('data-id')

            const request = await fetch(`${BASE_URL}/frontend_api/v1/follows/${userId}/`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                }
            })

            const response = await request.json()

            if (response.status === 'subscribed') {
                btn.style.background = '#E7E8EA'
                btn.style.border = '1px solid var(--main-border)'
                btn.style.color = '#70737B'
                btn.style.fontWeight = '600'
                btn.textContent = 'Отписаться'
            } else {
                btn.style.background = 'var(--main-color)'
                btn.style.color = 'white'
                btn.style.border = '1px solid var(--main-color)'
                btn.style.fontWeight = ''
                btn.textContent = 'Подписаться'
            }
        }
    }
}

window.bookmarksUpdate = bookmarksUpdate
window.commentBookmarksUpdate = commentBookmarksUpdate
window.domFollowFunc = domFollowFunc
window.likesUpdate = likesUpdate
window.commentLikedUpdate = commentLikedUpdate

document.addEventListener('DOMContentLoaded', async () => {
    likesUpdate()
    bookmarksUpdate()
    commentBookmarksUpdate()
    commentLikedUpdate()
    domFollowFunc()
})

function getThemeFromUrl() {
    const params = new URLSearchParams(window.location.search)
    return params.get('theme')
}


let nextPageUrl = null
let isLoading = null
let postsContainer = null
let lastQuery = ''

async function loadPosts() {
    if (!nextPageUrl || isLoading) return;
    isLoading = true

    const response = await fetch(nextPageUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    nextPageUrl = data.pages.next

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
                                        <a href="${BASE_URL}/users/${data.results[i].user}">${data.results[i].user}</a>
                                        <span style="color: gray;">${smart_time(data.results[i].pub_date)}</span>
                                    </div>
                                </div>
                            </div>
                            ${username !== data.results[i].user
                                ? `<div class="follow-btn" onclick="followFunc(this)" data-id="${data.results[i].user_id}" datatype="${username}">Подписаться</div>`
                                : ''
                            }
                        </div>
                    <br>
                        <a href="${BASE_URL}/category/?theme=${data.results[i].category}" class="post_category">${data.results[i].category}</a>
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
                        <a href="/home/post/${data.results[i].id}/#top">Читать далее</a>
                    </div>
                    <div class="icon-cont">
                        <div class="post-reactions">
                            <div class="like-wrapper" id="wrapper-id" onclick="func(this)" data-id="${data.results[i].id}">
                                <img src="/media/icons/hart.png" class="heart-img" id="like-button">
                                <span class="likes-count" id="likes-count-${data.results[i].id}">${data.results[i].liked_by.length}</span>
                            </div>
                            <div class="comment-wrapper">
                                <a href="/post/${data.results[i].id}/">
                                    <img src="/media/icons/comment.svg" class="comment-img">
                                </a>
                                <span class="comment-count">${data.results[i].comment_count}</span>
                            </div>
                            <div class="bookmark-wrapper" onclick="setBookmark(this)" data-id="${data.results[i].id}" data-section="bookmarks">
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
    likesUpdate()
    bookmarksUpdate()
    commentBookmarksUpdate()
    commentLikedUpdate()
    domFollowFunc()
    isLoading = false
}

async function searchPosts() {
    const BASE_URL = window.location.origin
    const query = document.querySelector('.search-input').value
    localStorage.setItem('isSearchMode', 'true')

    if (lastQuery !== query) {
        const params = new URLSearchParams(window.location.search)
        params.set('query', query)
        nextPageUrl = `${BASE_URL}/frontend_api/v1/search/?${params.toString()}`
        lastQuery = query

        const oldPosts = document.querySelectorAll('.post-wrapper')

        if (oldPosts) {
            oldPosts.forEach(post => post.remove())
        }
    }

    isLoading = false

    if (!nextPageUrl || isLoading) return;
    isLoading = true

    const response = await fetch(nextPageUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    nextPageUrl = data.pages.next

    const postsContainer = document.querySelector('.posts-container')


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
                                            <a href="${BASE_URL}/users/profile/${data.results[i].user}">${data.results[i].user}</a>
                                            <span style="color: gray;">${smart_time(data.results[i].pub_date)}</span>
                                        </div>
                                    </div>
                                </div>
                                ${username !== data.results[i].user
                                    ? `<div class="follow-btn" onclick="followFunc(this)" data-id="${data.results[i].user_id}" datatype="${user}">Подписаться</div>`
                                    : ''
                                }
                            </div>
                        <br>
                            <a href="${BASE_URL}/category/?theme=${data.results[i].category}" class="post_category">${data.results[i].category}</a>
                        <br>
                        <br>
                        <div class="title">
                            <a href="/home/post/${data.results[i].id}/#top">${data.results[i].title}</a>
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
                            <a href="/home/post/${data.results[i].id}/#top">Читать далее</a>
                        </div>
                        <div class="icon-cont">
                            <div class="post-reactions">
                                <div class="like-wrapper" id="wrapper-id" onclick="func(this)" data-id="${data.results[i].id}">
                                    <img src="/media/icons/hart.png" class="heart-img" id="like-button">
                                    <span class="likes-count" id="likes-count-${data.results[i].id}">${data.results[i].liked_by.length}</span>
                                </div>
                                <div class="comment-wrapper">
                                    <a href="/home/post/${data.results[i].id}/">
                                        <img src="/media/icons/comment.svg" class="comment-img">
                                    </a>
                                    <span class="comment-count">${data.results[i].comment_count}</span>
                                </div>
                                <div class="bookmark-wrapper" onclick="setBookmark(this)" data-id="${data.results[i].id}" data-section="bookmarks">
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
    window.bookmarksUpdate()
    window.likesUpdate()
    window.followFunc()
    window.domFollowFunc()
    isLoading = false
}


document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = window.location.origin
    const theme = getThemeFromUrl()
    const filter = activeElement
    const params = new URLSearchParams()
    if (theme) params.set('theme', theme)
    if (filter) params.set('filter', filter)

    nextPageUrl = `${BASE_URL}/frontend_api/v1/posts/?${params.toString()}`
    isLoading = false;
    postsContainer = document.querySelector('.posts-container')
    localStorage.setItem('isSearchMode', 'false')


    window.addEventListener('scroll', async () => {
        const isSearchMode = localStorage.getItem('isSearchMode')

        if (isSearchMode === 'false' && window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading) {
            await loadPosts()
        } else if (isSearchMode === 'true' && window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading) {
            await searchPosts()
        }
    })
})







