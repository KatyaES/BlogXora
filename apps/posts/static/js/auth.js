document.addEventListener('DOMContentLoaded', async () => {
    function isTokenExpired(token) {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const exp = payload.exp * 1000
        return Date.now() > exp
    }


    const token = localStorage.getItem('access')
    const BASE_URL = window.location.origin

    if (isTokenExpired(token)) {
        const refreshToken = localStorage.getItem('refresh')
        const response = await fetch(`${BASE_URL}/api/v1/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refresh: refreshToken })
        })
        if (response.ok) {
            const data = await response.json()
            localStorage.setItem('access', data.access)
        }
    }
})
