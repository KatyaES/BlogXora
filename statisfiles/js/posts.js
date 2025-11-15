if (window.location.href.endsWith('add_post/')) {
    document.querySelector('.input_wrapper').style.display = 'none'
}

const sendModer = document.getElementById('send-moder')
if (sendModer) {
    sendModer.addEventListener('click', async () => {
        const post_img = document.getElementById('img-input')
        const title = document.getElementById('title-id')
        const content = document.querySelector('.ql-editor')
        const theme = document.querySelector('.theme-cont')
        const cut_img = document.getElementById('cut-img')
        const status = await window.checkToken()
        const post_type = postType
        console.log(window.postType.textContent.length)

        const formData = new FormData()
        formData.append('wrapp_img', selectedFile)
        formData.append('cut_img', cut_img.src)
        formData.append('title', title.value)
        formData.append('content', content.innerHTML)
        formData.append('theme', theme.textContent)
        formData.append('post_type', window.postType.textContent)

        const BASE_URL = window.location.origin

        if (status) {
            const request = await fetch(`${BASE_URL}/frontend_api/v1/posts/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': window.csrfToken,
                },
                body: formData
            })
            if (request.status === 201) {
                window.location.href = '/'
            }
        }
    })
}

function initThemeSelector() {
	const themeCont = document.querySelector('.theme-cont')
	const themeBtn = document.querySelector('.themes')
	if (themeBtn && themeCont) {
        themeBtn.style.display = 'none'
        themeCont.addEventListener('click', () => {
            if (getComputedStyle(themeBtn).display === 'none') {
                themeBtn.style.display = 'flex'
                themeBtn.style.margin = '10px 0 0 0'
            } else {
                themeBtn.style.display = 'none'
            }
        })
	}

	const themesCont = document.querySelectorAll('.themes-cont .category-item')
	for (const item of themesCont) {
		item.addEventListener('click', () => {
			const old_img = themeCont.querySelector('img')
			if (old_img.id === 'cut-img') {old_img.remove()}
			themeCont.removeAttribute('img')
			const theme = item.textContent.trim()
			themeCont.firstChild.textContent = theme
			const themeBtn = document.querySelector('.themes')
			themeBtn.style.display = 'none'
			const cut_img = item.querySelector('img').cloneNode(true)
			cut_img.style.margin = '0 5px'
			cut_img.id = 'cut-img'
			themeCont.prepend(cut_img)
		})
	}
}

function initImageUploader() {
	const dragArea = document.getElementById('dragArea')
	const imgInput = document.getElementById('img-input')
	const imgPreview = document.getElementById('img-preview')
	const deleteImg = document.querySelector('.delete-img')
	const imgAndDelete = document.querySelector('.img-and-delete')
	const Preview = document.querySelector('.preview')
	const wrongFormat = document.getElementById('wrong-format')

	if (dragArea && imgInput && imgPreview && deleteImg &&
	    imgAndDelete && Preview && wrongFormat) {
	        dragArea.addEventListener('dragover', (e) => {
                e.preventDefault()
            })

            dragArea.addEventListener('click', () => {
                imgInput.click()
            })

            imgInput.addEventListener('change', (e) => {
                const file = e.target.files[0]
                if (!(file.name.endsWith('jpg') || file.name.endsWith('png') || file.name.endsWith('jpeg'))) {
                    imgPreview.removeAttribute('src')
                } else {
                    handleFile(file)
                    selectedFile = file
                }
            })

            dragArea.addEventListener('drop', (e) => {
                e.preventDefault()
                const files = e.dataTransfer.files
                if (files && files.length > 0) {
                    handleFile(files[0])
                    selectedFile = files[0]
                }
            })

            function handleFile(file) {
                if (!(file.name.endsWith('jpg') || file.name.endsWith('png') || file.name.endsWith('jpeg'))) {
                    wrongFormat.style.display = 'flex'
                } else {
                    const reader = new FileReader()
                    reader.onload = function(e) {
                    imgPreview.src = e.target.result
                }
                reader.readAsDataURL(file);
                imgPreview.style.display = 'block'
                imgInput.style.display = 'none'
                deleteImg.style.display = 'flex'
                imgAndDelete.style.display = 'flex'
                imgPreview.style.border = 'transparent'
                Preview.style.display = 'none'
                }
            }


            document.getElementById('dragArea').addEventListener('change', e => {
                const reader = new FileReader()
                reader.onload = function(e) {
                    document.getElementById('img-preview').src = e.target.result
                }
                if (!e.target.files[0].name.endsWith('jpg') || e.target.files[0].name.endsWith('png')) {
                    imgPreview.removeAttribute('src')
                    wrongFormat.style.display = 'flex'

                } else {
                    reader.readAsDataURL(e.target.files[0])
                    document.querySelector('.preview').style.display = 'none'
                    imgAndDelete.style.display = 'flex'
                    document.getElementById('img-preview').style.display = 'flex'
                    deleteImg.style.display = 'flex'
                }

            })

            deleteImg.addEventListener('click', () => {
                imgPreview.removeAttribute('src')
                imgPreview.style.display = 'none'
                document.querySelector('.preview').style.display = 'flex'
                deleteImg.style.display = 'none'
                imgInput.value = ''
                wrongFormat.style.display = 'none'
            })
	    }


}

function initScroll() {
    const topicsDropdown = document.querySelector('.topics-dropdown')
    const topicsSection = document.querySelector('.sidebar__section-topics')
    if (topicsDropdown) {
        topicsDropdown.addEventListener('click', () => {
            topicsDropdown.classList.add('topics-dropdown--hidden')
            topicsSection.classList.add('sidebar__section-topics--expanded')
        })
        window.addEventListener('scroll', () => {
            if (Math.round(window.scrollY) >= 200) {
                document.getElementById('scroll-id').style.display = 'block'
            } else if (Math.round(window.scrollY) === 0) {
                document.getElementById('scroll-id').style.display = 'none'
            }
        })
    }
    const scroll = document.getElementById('scroll-id')
    if (scroll) {
        scroll.addEventListener('click', () => {
            window.scrollTo(0, 0)
        })
    }
}

async function setPostLike(div) {
    try {
        const status = await window.checkToken()
        const id = div.getAttribute("data-id")

        const likesCount = document.getElementById(`like-button__count-id-${id}`);

        if (status) {
            const response = await fetch(`${BASE_URL}/frontend_api/v1/posts/${id}/set_like/`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    }
                })
            const data = await response.json()
            likesCount.textContent = data.likes;

            if (data.liked) {
                div.classList.add("like-button--active")
                likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                void likesCount.offsetWidth; // Принудительная перерисовка
                likesCount.classList.add('dellikeanimate');
            } else {
                div.classList.remove("like-button--active")
                likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                void likesCount.offsetWidth; // Принудительная перерисовка
                likesCount.classList.add('setlikeanimate');
            }
        }
    } catch (error) {
        console.error(error);
    }

}

async function profilePostsFunc() {
    const commentButton = document.getElementById('profile-nav__item_1')
    userId = commentButton.getAttribute('data-auth')
    const profileHeaderNavCont = document.querySelector('.profile-header-nav-cont')
    isLoadingComments = false;
    isLoadingPosts = true;
    localStorage.setItem('isSearchMode', 'false')

    profileHeaderNavCont.innerHTML = ''
    console.log(currentProfile)

    nextPostsPageUrl = `${BASE_URL}/frontend_api/v1/posts/get_user_posts/${currentProfile}`

    isLoadingPosts = false;
    postsContainer = profileHeaderNavCont
    localStorage.setItem('isSearchMode', 'false')
    const isSearchMode = localStorage.getItem('isSearchMode')

    const oldPosts = document.querySelectorAll('.post-wrapper')

    if (oldPosts) {
        oldPosts.forEach(post => post.remove())
    }
    profileHeaderNavCont.innerHTML = ''

    initLoadPosts()
    initPostBookmarks()
    initPostLikes()
    initUserFollows();
}

async function getFilterPosts(element) {
    const theme = getThemeFromUrl()
    const filter = postFilter
    const type = postType
    const params = new URLSearchParams()
    if (theme) params.set('theme', theme)
    if (filter) params.set('filter', filter)
    if (type) params.set('post_type', postType)

    nextPostsPageUrl = `${BASE_URL}/frontend_api/v1/posts/get_filter_queryset/?${params.toString()}`
    isLoadingPosts = false;
    postsContainer = document.querySelector('.posts-container')
    localStorage.setItem('isSearchMode', 'false')
    const isSearchMode = localStorage.getItem('isSearchMode')

    const oldPosts = document.querySelectorAll('.post-wrapper')

    if (oldPosts) {
        oldPosts.forEach(post => post.remove())
    }

    initLoadPosts()
}


async function initLoadPosts() {
    if (section && (!nextPostsPageUrl || isLoadingPosts || section === 'comments' || section === 'followers' || section === 'subscribes')) return;
    isLoadingPosts = true
    const response = await fetch(nextPostsPageUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    console.log(data)

    nextPostsPageUrl = data.pages.next
    const profileHeaderNavCont = document.querySelector('.profile-header-nav-cont')
    if (profileHeaderNavCont) {
        postsContainer = profileHeaderNavCont
    }

    for (let i = 0; i < data.results.length; i++) {

        if (document.getElementById(`post-${data.results[i].id}`)) continue;
        const posts = `
            <div class="post" id="post-${data.results[i].id}">
                <div class="post__header">
                    <div class="user-info">
                        <div class="user-info__meta">
                            <img src="${data.results[i].image}" class="user-info__avatar">
                                <div class="user-info__details">
                                    <a href="${window.BASE_URL}/users/${data.results[i].user}" class="user-info__username">${data.results[i].user}</a>
                                    <div class="user-info__date">${smart_time(data.results[i].pub_date)}</div>
                                </div>
                            </div>
                            ${currentUser !== data.results[i].user
                                ? `<div class="post__button-follow" onclick="userFollows(this)" data-id="${data.results[i].user_id}" datatype="${currentUser}">Подписаться</div>`
                                : ''
                            }
                        </div>
                    <br>
                        <div class="post__meta">
                            <a href="${BASE_URL}/${data.results[i].tag}" class="post__category">${data.results[i].category}</a>
                            <div class="post__type">${data.results[i].post_type}</div>
                        </div>
                    <br>
                    <br>
                    <div class="post__title">
                        <a href="/post/${data.results[i].id}">${data.results[i].title}</a>
                    </div>
                    <br>
                    <div class="post__content">
                        ${data.results[i].wrapp_img
                            ? `<img src="${data.results[i].wrapp_img}" class="post__wrapp-img">`
                            : ''
                        }
                        <p>${splitContent(data.results[i].content)}</p>
                    </div>
                    <div class="post__button-detail">
                        <a href="/post/${data.results[i].id}/">Читать далее</a>
                    </div>
                    <div class="post__actions">
                        <div class="reactions">
                            <div class="like-button" onclick="setPostLike(this)" data-id="${data.results[i].id}">
                                <img src="/media/icons/hart.png" class="like-button__icon">
                                <span class="like-button__count" id="like-button__count-id-${data.results[i].id}">${data.results[i].liked_by.length}</span>
                            </div>
                            <div class="comment-button">
                                <img src="/media/icons/comment.svg" class="comment-button__icon" onclick="window.location.href = '/post/${data.results[i].id}/'">
                                <span class="comment-button__count">${data.results[i].comment_count}</span>
                            </div>
                            <div class="bookmark-button" onclick="setPostBookmark(this)" data-id="${data.results[i].id}" data-section="bookmarks">
                                <svg class="bookmark-button__icon" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M6 2C5.44772 2 5 2.44772 5 3V21C5 21.2761 5.22386 21.5 5.5 21.5C5.63261 21.5 5.76522 21.4477 5.85355 21.3536L12 15.7071L18.1464 21.3536C18.2348 21.4477 18.3674 21.5 18.5 21.5C18.7761 21.5 19 21.2761 19 21V3C19 2.44772 18.5523 2 18 2H6Z" stroke-width="2"/>
                                </svg>
                                <span class="bookmark-button__count" id="bookmark-button__count-id-${data.results[i].id}">${data.results[i].bookmark_user.length}</span>
                            </div>
                        </div>
                        <div class="post__views">
                            <img src="/media/icons/view.svg" class="post__view-icon">
                            <span class="post__view-count">${data.results[i].views_count}</span>
                        </div>
                    </div>
                </div>
            </div>
        `
        postsContainer.insertAdjacentHTML('beforeend', posts)
    }
    initPostBookmarks()
    initPostLikes()
    initUserFollows();
    isLoadingPosts = false
}

function getThemeFromUrl() {
    const category = decodeURIComponent(window.location.pathname.split('/')[1])
    console.log(category)
    if (category !== 'users') return category;
}

async function initScrollForPosts() {
    const theme = getThemeFromUrl()
    const filter = postFilter
    const type = postType
    const params = new URLSearchParams()
    console.log(theme)
    console.log(filter)
    console.log(postType)
    if (theme) params.set('tag', theme)
    if (filter) params.set('filter', filter)
    if (type) params.set('post_type', postType)

    if (window.location.pathname.startsWith('/')) isLoadingPosts = false;

    nextPostsPageUrl = `${window.BASE_URL}/frontend_api/v1/posts/?${params.toString()}`
    nextCommentsPageUrl = `${BASE_URL}/frontend_api/v1/comments/?post_pk=${postID}`

    postsContainer = document.querySelector('.posts-container')
    localStorage.setItem('isSearchMode', 'false')


    window.addEventListener('scroll', async () => {
        const moreComments = localStorage.getItem('moreComments')
        const isSearchMode = localStorage.getItem('isSearchMode')

        if (isSearchMode === 'false' && window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            if (!isLoadingPosts) {
                console.log(1)
                await initLoadPosts()
            }
            if (!moreComments && path.startsWith('/post/')) return;
            if (!isLoadingComments && path.startsWith('/post/') && moreComments === 'true') {
                await initLoadPostComments()
            }
            if (!isLoadingComments && path.endsWith('/comments/')) {
                await initLoadComments()
            }

        }
        if (isSearchMode === 'true' && window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            console.log(2)
            await searchPosts()
        }
    })
}

async function initPostLikes() {
    const status = await window.checkToken()
    const imgWrapper = document.querySelectorAll(".like-button");
    const BASE_URL = window.location.origin

    if (status) {
        for (const img of imgWrapper) {
            const id = img.getAttribute("data-id");
            const likesCount = document.getElementById(`like-button__count-id-${id}`);
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
                    img.classList.add("like-button--active")
                } else {
                    img.classList.remove("like-button--active")
                }
            } else {
                img.classList.remove("like-button--active")
            }
        }
    }
}


function setPostType(element) {
    const elements = document.querySelectorAll('.filters__type-option')
    if (element.classList.contains('selected')) {
        element.classList.remove('selected')
        window.postType = null
    } else {
        elements.forEach(el => el.classList.remove('selected'))
        element.classList.add('selected')
        window.postType = element.textContent
    }
}