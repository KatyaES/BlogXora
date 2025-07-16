async function followFunc(div) {
    const userId = div.getAttribute('data-id')

    const token = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')
    const BASE_URL = window.location.origin

    if (token) {
        const request = await fetch(`${BASE_URL}/api/v1/follows/${userId}/`, {
        method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
			'Authorization': `Bearer ${token}`,
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
    } else {alert('Для этого действия требуется войти в аккаунт')}
}

document.addEventListener('DOMContentLoaded', async () => {
    const followBtn = document.querySelectorAll('.follow-btn')

    const token = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')
    const BASE_URL = window.location.origin

    for (const btn of followBtn) {
        const userId = btn.getAttribute('data-id')

        if (token) {
            const request = await fetch(`${BASE_URL}/api/v1/follows/${userId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                    'Authorization': `Bearer ${token}`,
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