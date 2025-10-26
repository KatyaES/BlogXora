async function setPostBookmark(element) {
    try {
        const post_id = element.getAttribute("data-id")
        const BASE_URL = window.location.origin

        const status = await window.checkToken()
        const bookmarksCount = document.getElementById(`bookmark-button__count-id-${post_id}`)

        if (status) {
            const response = await fetch(`${BASE_URL}/frontend_api/v1/posts/${post_id}/set_bookmark/`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': window.csrfToken,
                },
            })
            const data = await response.json()

            bookmarksCount.textContent = data.bookmark_count;

            if (data.is_authenticated) {
                if (data.set_bookmark) {
                    element.classList.add("bookmark-button--active")
                    bookmarksCount.classList.remove('setlikeanimate', 'dellikeanimate')
                    void bookmarksCount.offsetWidth
                    bookmarksCount.classList.add('dellikeanimate');
                } else {
                    element.classList.remove("bookmark-button--active")
                    bookmarksCount.classList.remove('setlikeanimate', 'dellikeanimate')
                    void bookmarksCount.offsetWidth;
                    bookmarksCount.classList.add('setlikeanimate');
                }
            } else {
                element.classList.remove("bookmark-button--active")
                bookmarksCount.classList.remove('setlikeanimate', 'dellikeanimate')
                void bookmarksCount.offsetWidth;
                bookmarksCount.classList.add('setlikeanimate');
            }
        }

    } catch (error) {
        console.error(error);
    }
}


async function setCommentBookmark(element) {
    try {
        const comment_id = element.getAttribute("data-id")
        const BASE_URL = window.location.origin

        const status = await window.checkToken()
        const bookmarksCount = document.getElementById(`comment__bookmark-count-id-${comment_id}`)

        if (status) {
            const response = await fetch(`${BASE_URL}/frontend_api/v1/comments/${comment_id}/set_bookmark/`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': window.csrfToken,
                },
            })
            const data = await response.json()
            bookmarksCount.textContent = data.bookmarked_by.length;

            if (data.is_authenticated) {
                if (data.set_bookmark) {
                    element.classList.add("comment__bookmark-button--active")
                    bookmarksCount.classList.remove('setlikeanimate', 'dellikeanimate')
                    void bookmarksCount.offsetWidth
                    bookmarksCount.classList.add('dellikeanimate');
                } else {
                    element.classList.remove("comment__bookmark-button--active")
                    bookmarksCount.classList.remove('setlikeanimate', 'dellikeanimate')
                    void bookmarksCount.offsetWidth;
                    bookmarksCount.classList.add('setlikeanimate');
                }
            } else {
                element.classList.remove("comment__bookmark-button--active")
                bookmarksCount.classList.remove('setlikeanimate', 'dellikeanimate')
                void bookmarksCount.offsetWidth;
                bookmarksCount.classList.add('setlikeanimate');
            }
        }

    } catch (error) {
        console.error(error);
    }
}

async function initPostBookmarks() {
    const BASE_URL = window.location.origin

    const bookmarkWrapper = document.querySelectorAll(".bookmark-button");
    const status = window.checkToken(true)

    for (const img of bookmarkWrapper) {
        const id = img.getAttribute("data-id");
        const bookmarkCount = document.getElementById(`bookmark-button__count-id-${id}`);

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
                        img.classList.add("bookmark-button--active")
                        bookmarkCount.classList.remove('setlikeanimate', 'dellikeanimate')
                        void bookmarkCount.offsetWidth
                        bookmarkCount.classList.add('dellikeanimate');
                    } else {
                        img.classList.remove("bookmark-button--active")
                        bookmarkCount.classList.remove('setlikeanimate', 'dellikeanimate')
                        void bookmarkCount.offsetWidth;
                        bookmarkCount.classList.add('setlikeanimate');
                    }
                } else {
                    img.classList.remove("bookmark-button--active")
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

async function initCommentBookmarks() {
    const BASE_URL = window.location.origin

    const bookmarkWrapper = document.querySelectorAll(".comment__bookmark-button");
    const status = window.checkToken(true)

    for (const img of bookmarkWrapper) {
        const comment_id = img.getAttribute("data-id");
        const bookmarkCount = document.getElementById(`comment__bookmark-count-id-${comment_id}`);

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

                if (data.is_authenticated) {
                    if (data.set_bookmark) {
                        img.classList.add("comment__bookmark-button--active")
                        bookmarkCount.classList.remove('setlikeanimate', 'dellikeanimate')
                        void bookmarkCount.offsetWidth
                        bookmarkCount.classList.add('dellikeanimate');
                    } else {
                        img.classList.remove("comment__bookmark-button--active")
                        bookmarkCount.classList.remove('setlikeanimate', 'dellikeanimate')
                        void bookmarkCount.offsetWidth;
                        bookmarkCount.classList.add('setlikeanimate');
                    }
                } else {
                    img.classList.remove("comment__bookmark-button--active")
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
