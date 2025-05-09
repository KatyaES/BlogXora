async function followFunc(div) {
    const userId = div.getAttribute('data-id')
    console.log(userId)

    const token = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')

    if (token) {
        const request = await fetch(`http://127.0.0.1:8000/api/follows/${userId}/`, {
        method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
		},
		body: JSON.stringify({})
        })
        console.log('request', request)

        const response = await request.json()

        console.log('response', response)

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

    for (const btn of followBtn) {
        const userId = btn.getAttribute('data-id')

        const request = await fetch(`http://127.0.0.1:8000/api/follows/${userId}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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
})