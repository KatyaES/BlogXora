export default async function likesUpdate() {

    const token = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')

    const imgWrapper = document.querySelectorAll(".like-wrapper");
    const BASE_URL = window.location.origin

    for (const img of imgWrapper) {
        const id = img.getAttribute("data-id");
        const likesCount = document.getElementById(`likes-count-${id}`);

        try {
            // Запрос к серверу
            const response = await fetch(`${BASE_URL}/api/v1/posts/${id}/like/`, {
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
        }
    }
}