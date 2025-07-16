async function themeFollowFunc(span) {
    const userId = span.getAttribute('data-id')
    const theme = span.getAttribute('datatype')

    const token = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')
    const BASE_URL = window.location.origin

    if (token) {
        const request = await fetch(`${BASE_URL}/users/theme_follows/?theme=${theme}`, {
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
            span.style.background = '#E7E8EA'
            span.style.color = '#70737B'
            span.style.fontWeight = '600'
            span.textContent = 'Отписаться'
        } else {
            span.style.background = '#4a90e2'
            span.style.color = 'white'
            span.style.fontWeight = ''
            span.textContent = 'Подписаться'
        }
    } else {alert('Для этого действия требуется войти в аккаунт')}
}

document.addEventListener('DOMContentLoaded', async () => {
    const followBtn = document.querySelector('.theme_subscribe-btn')
    const theme = followBtn.getAttribute('datatype')
    const token = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')

    const userId = followBtn.getAttribute('data-id')

    const BASE_URL = window.location.origin

    const request = await fetch(`${BASE_URL}/users/theme_follows/?theme=${theme}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })

    const response = await request.json()

    if (response.status === 'subscribed') {
        followBtn.style.background = '#E7E8EA'
        followBtn.style.color = '#70737B'
        followBtn.style.fontWeight = '600'
        followBtn.textContent = 'Отписаться'
    } else {
        followBtn.style.background = '#4a90e2'
        followBtn.style.color = 'white'
        followBtn.style.fontWeight = ''
        followBtn.textContent = 'Подписаться'
    }
})