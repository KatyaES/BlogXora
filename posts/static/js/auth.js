document.addEventListener('DOMContentLoaded', async () => {
    function isTokenExpired(token) {
        const payload = JSON.parse(atob(token.split('.')[1]))

        const exp = payload.exp * 1000
        console.log((exp / 60000) - (Date.now() / 60000))
        return Date.now() > exp
    }


    const token = localStorage.getItem('access')

    if (!token || isTokenExpired(token)) {
        const refreshToken = localStorage.getItem('refresh')
        const response = await fetch(`http://127.0.0.1:8000/api/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refresh: refreshToken })
        })

        if (response.ok) {
            const data = await response.json()
            localStorage.setItem('access', data.access)
            console.log('Токен успешно обновлен')
        } else { console.log('error update token')}
    }
})
