if (window.location.href.endsWith('add_post/')) {
    document.querySelector('.input_wrapper').style.display = 'none'
}


let selectedFile = null;

document.getElementById('send-moder').addEventListener('click', async () => {
	const post_img = document.getElementById('img-input')
	const title = document.getElementById('title-id')
	const content = document.querySelector('.ql-editor')
	const theme = document.querySelector('.theme-cont')
	const cut_img = document.getElementById('cut-img')
	const status = await window.checkToken()

	const formData = new FormData()
	formData.append('wrapp_img', selectedFile)
	formData.append('cut_img', cut_img.src)
	formData.append('title', title.value)
	formData.append('content', content.innerHTML)
	formData.append('theme', theme.textContent)

	const BASE_URL = window.location.origin

    if (status) {
        const request = await fetch(`${BASE_URL}/frontend_api/v1/posts/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFToken': window.csrfToken,
            },
            body: formData
        })
        if (request.status === 201) {
            window.location.href = '/'
        }
    }
})

document.addEventListener('DOMContentLoaded', () => {
	const themeCont = document.querySelector('.theme-cont')
	const themeBtn = document.querySelector('.themes')
	themeBtn.style.display = 'none'
	themeCont.addEventListener('click', () => {
		if (getComputedStyle(themeBtn).display === 'none') {
			themeBtn.style.display = 'flex'
			themeBtn.style.margin = '10px 0 0 0'
		} else {
			themeBtn.style.display = 'none'
		}
	})
	const themesCont = document.querySelectorAll('.themes-cont .category-item')
	for (const item of themesCont) {
		item.addEventListener('click', () => {
			const old_img = themeCont.querySelector('img')
			if (old_img.id === 'cut-img') {old_img.remove()}
			themeCont.removeAttribute('img')
			const theme = item.textContent.trim()
			themeCont.firstChild.textContent = theme
			const themeBtn = document.querySelector('.themes')
			themeBtn.style.display = 'none'
			const cut_img = item.querySelector('img').cloneNode(true)
			cut_img.style.margin = '0 5px'
			cut_img.id = 'cut-img'
			themeCont.prepend(cut_img)
		})
	}
})

document.addEventListener('DOMContentLoaded', () => {
	const dragArea = document.getElementById('dragArea')
	const imgInput = document.getElementById('img-input')
	const imgPreview = document.getElementById('img-preview') 
	const deleteImg = document.querySelector('.delete-img')
	const imgAndDelete = document.querySelector('.img-and-delete')
	const Preview = document.querySelector('.preview')
	const wrongFormat = document.getElementById('wrong-format')

	dragArea.addEventListener('dragover', (e) => {
		e.preventDefault()
	})

	dragArea.addEventListener('click', () => {
		imgInput.click()
	})

	imgInput.addEventListener('change', (e) => {
		const file = e.target.files[0]
		if (!(file.name.endsWith('jpg') || file.name.endsWith('png') || file.name.endsWith('jpeg'))) {
			imgPreview.removeAttribute('src')
		} else {
			handleFile(file)
			selectedFile = file
		}
	})

	dragArea.addEventListener('drop', (e) => {
		e.preventDefault()
		const files = e.dataTransfer.files
		if (files && files.length > 0) {
			handleFile(files[0])
			selectedFile = files[0]
		}
	})

	function handleFile(file) {
		if (!(file.name.endsWith('jpg') || file.name.endsWith('png') || file.name.endsWith('jpeg'))) {
			wrongFormat.style.display = 'flex'
		} else {
			const reader = new FileReader()
			reader.onload = function(e) {
			imgPreview.src = e.target.result
		}
		reader.readAsDataURL(file);
		imgPreview.style.display = 'block'
		imgInput.style.display = 'none'
		deleteImg.style.display = 'flex'
		imgAndDelete.style.display = 'flex'
		imgPreview.style.border = 'transparent'
		Preview.style.display = 'none'
		}
	}


	document.getElementById('dragArea').addEventListener('change', e => {
		const reader = new FileReader()
		reader.onload = function(e) {
			document.getElementById('img-preview').src = e.target.result
		}
		if (!e.target.files[0].name.endsWith('jpg') || e.target.files[0].name.endsWith('png')) {
			imgPreview.removeAttribute('src')
			wrongFormat.style.display = 'flex'

		} else {
			reader.readAsDataURL(e.target.files[0])
			document.querySelector('.preview').style.display = 'none'
			imgAndDelete.style.display = 'flex'
			document.getElementById('img-preview').style.display = 'flex'
			deleteImg.style.display = 'flex'
		}

	})

	deleteImg.addEventListener('click', () => {
		imgPreview.removeAttribute('src')
		imgPreview.style.display = 'none'
		document.querySelector('.preview').style.display = 'flex'
		deleteImg.style.display = 'none'
		imgInput.value = ''
		wrongFormat.style.display = 'none'
	})
})





