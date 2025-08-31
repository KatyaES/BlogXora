async function func(div) {
    try {
        const status = await window.checkToken()
        const id = div.getAttribute("data-id")
        const BASE_URL = window.location.origin

        const likesCount = document.getElementById(`likes-count-${id}`);

        if (status) {
            const response = await fetch(`${BASE_URL}/frontend_api/v1/posts/${id}/set_like/`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
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
        }
    } catch (error) {
        console.error(error);
    }

}

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
