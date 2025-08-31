async function checkToken(showAlert = true) {
    const BASE_URL = window.location.origin
    const isLoggingOut = localStorage.getItem('isLoggingOut')
    const response = await fetch(`${BASE_URL}/frontend_api/v1/token/refresh/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.status === 400 || response.status === 401) {
         if (isLoggingOut === 'false') {
            const request = await fetch(`${BASE_URL}/users/logout/`, {
                method: 'POST',
                credentials: 'include',
                cache: 'reload',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': window.csrfToken,
                }
            })
            localStorage.clear()
            localStorage.setItem('isLoggingOut', true)
            window.location.href = '/'
          }
//        } else if (isLoggingOut === 'true') {
////            if (showAlert) {
////                alert('Needed authentication')
////            }
//        }
    } else if (response.status === 200) {
        return response.status
    }
}
window.checkToken = checkToken
