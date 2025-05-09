async function func(div) {
    try {

        const token = localStorage.getItem('access')
        const refresh = localStorage.getItem('refresh')
        const id = div.getAttribute("data-id")

        const likesCount = document.getElementById(`likes-count-${id}`);

        // Логируем добавление класса
        if (token) {
            const request = await fetch(`http://127.0.0.1:8000/api/likes_response/${id}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({})
            })
            const response = await fetch(`http://127.0.0.1:8000/api/likes_response/${id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    }
                })
            const data = await response.json()
            document.getElementById(`likes-count-${id}`).textContent = data.likes;

            if (data.liked) {
                div.classList.replace("like-wrapper", "like-wrapper-liked")
                likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                void likesCount.offsetWidth; // Принудительная перерисовка
                likesCount.classList.add('dellikeanimate');
            } else {
                div.classList.replace("like-wrapper-liked", "like-wrapper")
                likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                void likesCount.offsetWidth; // Принудительная перерисовка
                likesCount.classList.add('setlikeanimate');
            }
        } else { alert('Для этого действия нужно авторизоваться')}


    } catch (error) {
        console.error(error);
    }

}

document.addEventListener('DOMContentLoaded', async () => {
    console.log(1)

    const token = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')

    const imgWrapper = document.querySelectorAll(".like-wrapper");

    for (const img of imgWrapper) {
        const id = img.getAttribute("data-id");
        const likesCount = document.getElementById(`likes-count-${id}`);

        try {
            // Запрос к серверу
            const response = await fetch(`http://127.0.0.1:8000/api/likes_response/${id}/`, {
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
                if (data.liked) {
                    img.classList.replace("like-wrapper", "like-wrapper-liked")
                    likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                    void likesCount.offsetWidth; // Принудительная перерисовка
                    likesCount.classList.add('dellikeanimate');
                } else {
                    img.classList.replace("like-wrapper-liked", "like-wrapper")
                    likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                    void likesCount.offsetWidth; // Принудительная перерисовка
                    likesCount.classList.add('setlikeanimate');
                }
            } else {
                img.classList.replace("like-wrapper-liked", "like-wrapper")
                likesCount.classList.remove('setlikeanimate', 'dellikeanimate'); // Убираем все
                void likesCount.offsetWidth; // Принудительная перерисовка
                likesCount.classList.add('setlikeanimate');
            }
        } catch (error) {
            console.error("Ошибка при запросе для id " + id + ":", error);
        }
    }
})

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('virt-button').addEventListener('click', () => {
        document.getElementById('virt-button').style.display = 'none'
        document.getElementById('popular-id').style.height = '1600px'
    })
})

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', () => {
        if (Math.round(window.scrollY) >= 200) {
            document.getElementById('scroll-id').style.display = 'block'
        } else if (Math.round(window.scrollY) === 0) {
            document.getElementById('scroll-id').style.display = 'none'
        }
    })
    document.getElementById('scroll-id').addEventListener('click', () => {
        window.scrollTo(0, 0)
    })
})
