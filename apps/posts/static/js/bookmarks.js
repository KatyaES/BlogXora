async function setBookmark(div) {
    try {
        const token = localStorage.getItem('access')
        const refresh = localStorage.getItem('refresh')
        const post_id = div.getAttribute("data-id")
        const BASE_URL = window.location.origin


        const bookmarksCount = document.querySelectorAll(`[data-id="${post_id}"][data-section="bookmarks"]`)

        for (let i = 0; i < bookmarksCount.length; i++) {
            const elem = bookmarksCount[i]
            const elemCount = elem.querySelector('.bookmark-count')
            if (token) {
                const request = await fetch(`${BASE_URL}/api/v1/bookmarks/?id=${post_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({})
                })
                const response = await fetch(`${BASE_URL}/api/v1/bookmarks/?id=${post_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        }
                    })
                const data = await response.json()

                elemCount.textContent = data.bookmark_count;
                if (data.is_authenticated) {
                    if (data.set_bookmark) {
                        div.classList.replace("bookmark-wrapper", "bookmark-wrapper-set")
                        bookmarksCount.forEach(el => {
                            el.classList.remove('setlikeanimate', 'dellikeanimate');
                            void el.offsetWidth;
                            el.classList.add('dellikeanimate');
                            })
                    } else {
                        div.classList.replace("bookmark-wrapper-set", "bookmark-wrapper")
                        bookmarksCount.forEach(el => {
                            el.classList.remove('setlikeanimate', 'dellikeanimate');
                            void el.offsetWidth;
                            el.classList.add('setlikeanimate')
                            })
                    }
                } else { alert('Для этого действия нужно авторизоваться')}
            }
        }

    } catch (error) {
        console.error(error);
    }
}


document.addEventListener('DOMContentLoaded', async () => {

    const token = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')
    const BASE_URL = window.location.origin

    const bookmarkWrapper = document.querySelectorAll(".bookmark-wrapper");

    for (const img of bookmarkWrapper) {
        const id = img.getAttribute("data-id");
        const bookmarkCount = document.getElementById(`bookmark-count-${id}`);

        try {
            if (token) {
                const response = await fetch(`${BASE_URL}/api/v1/bookmarks/?id=${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                        }
                    });
                const data = await response.json();

                if (data.is_authenticated) {
                    if (data.set_bookmark) {
                        img.classList.replace("bookmark-wrapper", "bookmark-wrapper-set")
                        bookmarkCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                        void bookmarkCount.offsetWidth; // Принудительная перерисовка
                        bookmarkCount.classList.add('dellikeanimate');
                    } else {
                        img.classList.replace("bookmark-wrapper-set", "bookmark-wrapper")
                        bookmarkCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                        void bookmarkCount.offsetWidth; // Принудительная перерисовка
                        bookmarkCount.classList.add('setlikeanimate');
                    }
                } else {
                    img.classList.replace("bookmark-wrapper-et", "bookmark-wrapper")
                    bookmarkCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                    void bookmarkCount.offsetWidth; // Принудительная перерисовка
                    bookmarkCount.classList.add('setlikeanimate');
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
})