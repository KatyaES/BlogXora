async function setBookmark(div) {
    try {
        console.log(localStorage)
        const token = localStorage.getItem('access')
        const refresh = localStorage.getItem('refresh')
        const post_id = div.getAttribute("data-id")
        console.log('post_id', post_id)


        const bookmarksCount = document.querySelectorAll(`[data-id="${post_id}"][data-section="bookmarks"]`)

        for (let i = 0; i < bookmarksCount.length; i++) {
            const elem = bookmarksCount[i]
            console.log(elem)
            const elemCount = elem.querySelector('.bookmark-count')
            console.log(elemCount)
            console.log('bookmarksCount', bookmarksCount)
            if (token) {
                const request = await fetch(`http://127.0.0.1:8000/api/bookmarks/?id=${post_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({})
                })
                console.log('POST success')
                const response = await fetch(`http://127.0.0.1:8000/api/bookmarks/?id=${post_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        }
                    })
                const data = await response.json()
                console.log(data)
                console.log(elemCount.textContent, elemCount)

                elemCount.textContent = data.bookmark_count;
                if (data.is_authenticated) {
                    if (data.set_bookmark) {
                        console.log(bookmarksCount)
                        div.classList.replace("bookmark-wrapper", "bookmark-wrapper-set")
                        bookmarksCount.forEach(el => {
                            el.classList.remove('setlikeanimate', 'dellikeanimate');
                            void el.offsetWidth;
                            el.classList.add('dellikeanimate');
                            })
                        console.log(bookmarksCount)
                    } else {
                        console.log(bookmarksCount)
                        div.classList.replace("bookmark-wrapper-set", "bookmark-wrapper")
                        bookmarksCount.forEach(el => {
                            el.classList.remove('setlikeanimate', 'dellikeanimate');
                            void el.offsetWidth;
                            el.classList.add('setlikeanimate')
                            })
                        console.log(bookmarksCount)
                    }
                } else { alert('Для этого действия нужно авторизоваться')}
            }
        }

    } catch (error) {
        console.error(error);
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    console.log(9)

    const token = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')

    const bookmarkWrapper = document.querySelectorAll(".bookmark-wrapper");

    for (const img of bookmarkWrapper) {
        const id = img.getAttribute("data-id");
        const bookmarkCount = document.getElementById(`bookmark-count-${id}`);

        try {
            // Запрос к серверу
            const response = await fetch(`http://127.0.0.1:8000/api/bookmarks/?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                    }
                });
            const data = await response.json();

            // Печатаем, что вернул сервер
            // Проверяем, авторизован ли пользователь
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
        } catch (error) {
            console.error("Ошибка при запросе для id " + id + ":", error);
        }
    }
})