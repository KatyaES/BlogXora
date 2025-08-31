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
                const response = await fetch(`${BASE_URL}/frontend_api/v1/bookmarks/${id}/`, {
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

window.bookmarksUpdate = bookmarksUpdate
window.likesUpdate = likesUpdate
window.commentLikedUpdate = commentLikedUpdate

document.addEventListener('DOMContentLoaded', async () => {
    likesUpdate()
})



document.addEventListener('DOMContentLoaded', () => {
    let nextPageUrl = `${BASE_URL}/frontend_api/v1/posts/`
    let isLoading = false;
    const postsContainer = document.querySelector('.posts-container')
    localStorage.setItem('isSearchMode', 'false')
    const isSearchMode = localStorage.getItem('isSearchMode')

     window.addEventListener('scroll', async () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10 && !isLoading) {
            if (!nextPageUrl) {
                return;
            } else {
                isLoading = true;
                if (isSearchMode === 'false') {
                    const response = await fetch(nextPageUrl, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
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
                                                        <a href="${BASE_URL}/users/profile/${data.results[i].user}">${data.results[i].user}</a>
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
                                        <img src="${data.results[i].wrapp_img}" alt="">
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
                                                    <img src="/media/icons/bookmark.svg" class="bookmark-img">
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
                    await likesUpdate()
                    window.bookmarksUpdate()
                    isLoading = false
                    const imgWrapper = document.querySelectorAll(".like-wrapper");
                }
            }
        }
    })
})
