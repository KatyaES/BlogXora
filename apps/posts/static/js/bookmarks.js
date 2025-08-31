async function setBookmark(div) {
    try {
        const post_id = div.getAttribute("data-id")
        const BASE_URL = window.location.origin

        const status = await window.checkToken()
        const bookmarksCount = document.getElementById(`bookmark-count-${post_id}`)

        if (status) {
            const request = await fetch(`${BASE_URL}/frontend_api/v1/bookmarks/${post_id}/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': window.csrfToken,
            },
            body: JSON.stringify({})
            })
            const response = await fetch(`${BASE_URL}/frontend_api/v1/bookmarks/${post_id}/`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    }
                })
            const data = await response.json()

            bookmarksCount.textContent = data.bookmark_count;
            if (data.is_authenticated) {
                if (data.set_bookmark) {
                    div.classList.replace("bookmark-wrapper", "bookmark-wrapper-set")
                    bookmarksCount.classList.remove('setlikeanimate', 'dellikeanimate')
                    void bookmarksCount.offsetWidth
                    bookmarksCount.classList.add('dellikeanimate');
                } else {
                    div.classList.replace("bookmark-wrapper-set", "bookmark-wrapper")
                    bookmarksCount.classList.remove('setlikeanimate', 'dellikeanimate')
                    void bookmarksCount.offsetWidth;
                    bookmarksCount.classList.add('setlikeanimate');
                }
            } else {
                div.classList.replace("bookmark-wrapper-set", "bookmark-wrapper")
                bookmarksCount.classList.remove('setlikeanimate', 'dellikeanimate')
                void bookmarksCount.offsetWidth;
                bookmarksCount.classList.add('setlikeanimate');
            }
        }

    } catch (error) {
        console.error(error);
    }
}


document.addEventListener('DOMContentLoaded', async () => {
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
})