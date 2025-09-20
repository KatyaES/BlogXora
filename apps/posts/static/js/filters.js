let activeElement = null

function splitContent(value) {
    const paragraphs = value.split('</p>');
    const first = paragraphs[0] + '</p>';

    const text = first.replace(/<.*?>/g, '');

    if (text.length <= 300) {
        return first;
    } else {
        return '';
    }
}


function smart_time(date) {
    const result = Date.now() - new Date(date).getTime()
    const seconds = Math.floor(result / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(seconds / 3600)
    const days = Math.floor( hours / 24)


    if (days > 0) {
        return new Date(date).toLocaleString('ru-Ru', {
            day: 'numeric',
            month: 'long',
        })
    }

    if (hours > 0) {
        return `${hours} ч назад`
    } else {
        if (minutes < 1) {
            return `${seconds} с назад`
        } else {
            return `${minutes} мин назад`
        }
    }
}



async function setFilter(element) {
    const elements = document.querySelectorAll('.item_filter')
    if (element === activeElement) {
        element.checked = false
        activeElement = null
    } else {
        elements.forEach(el => {
            if (el !== element) {
                el.checked = false
            }
        })
        activeElement = element
    }
}

async function getFilterPosts(element) {
    const theme = getThemeFromUrl()
    const filter = activeElement.value
    const params = new URLSearchParams()
    if (theme) params.set('theme', theme)
    if (filter) params.set('filter', filter)

    nextPageUrl = `${BASE_URL}/frontend_api/v1/posts/?${params.toString()}`
    isLoading = false;
    postsContainer = document.querySelector('.posts-container')
    localStorage.setItem('isSearchMode', 'false')
    const isSearchMode = localStorage.getItem('isSearchMode')

    const oldPosts = document.querySelectorAll('.post-wrapper')

    if (oldPosts) {
        oldPosts.forEach(post => post.remove())
    }

    loadPosts()
}

function moveArrow() {
    const lentaButton = document.querySelector('.filter_arrow')
    const filtersContainer = document.querySelector('.filters-container')
    if (lentaButton.classList.contains('down')) {
        lentaButton.classList.remove('down')
        lentaButton.classList.add('up')
        filtersContainer.style.height = 'auto'
        filtersContainer.style.padding = '25px 25px 15px 25px'
    } else {
        lentaButton.classList.remove('up')
        lentaButton.classList.add('down')
        filtersContainer.style.height = '20px'
        filtersContainer.style.overflow = 'hidden'
        filtersContainer.style.padding = '25px 25px 25px 25px'
    }
}