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
            div.style.border = '1px solid var(--main-border)'
            div.style.color = '#70737B'
            div.style.fontWeight = '600'
            div.textContent = 'Отписаться'
        } else {
            div.style.background = 'var(--main-color)'
            div.style.color = 'white'
            div.style.border = '1px solid var(--main-color)'
            div.style.fontWeight = ''
            div.textContent = 'Подписаться'
        }
    }
}

window.domFollowFunc()