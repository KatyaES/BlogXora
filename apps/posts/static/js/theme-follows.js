async function themeFollowFunc(span) {
    const userId = span.getAttribute('data-id')
    const theme = span.getAttribute('datatype')

    const status = await window.checkToken()
    const BASE_URL = window.location.origin
    localStorage.setItem('isSearchMode', 'true')

    if (status) {
        const request = await fetch(`${BASE_URL}/users/theme_follows/?theme=${theme}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': window.csrfToken,
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
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const followBtn = document.querySelector('.theme_subscribe-btn')
    const theme = followBtn.getAttribute('datatype')
    const status = await window.checkToken(false)

    const userId = followBtn.getAttribute('data-id')

    const BASE_URL = window.location.origin

    if (status) {
        const request = await fetch(`${BASE_URL}/users/theme_follows/?theme=${theme}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
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
    }
})