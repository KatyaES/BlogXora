async function followFunc(div) {
    const userId = div.getAttribute('data-id')

    const status = await window.checkToken()
    const BASE_URL = window.location.origin

    if (status) {
        const request = await fetch(`${BASE_URL}/frontend_api/v1/follows/${userId}/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({})
            })

        const response = await request.json()


        if (response.status === 'add') {
            div.style.background = '#E7E8EA'
            div.style.color = '#70737B'
            div.style.fontWeight = '600'
            div.textContent = 'Отписаться'
        } else {
            div.style.background = '#4a90e2'
            div.style.color = 'white'
            div.style.fontWeight = ''
            div.textContent = 'Подписаться'
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
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
                btn.style.color = '#70737B'
                btn.style.fontWeight = '600'
                btn.textContent = 'Отписаться'
            } else {
                btn.style.background = '#4a90e2'
                btn.style.color = 'white'
                btn.style.fontWeight = ''
                btn.textContent = 'Подписаться'
            }
        }
    }
})