if (window.location.href.endsWith('add_post/')) {
    document.querySelector('.input_wrapper').style.display = 'none'
}


let selectedFile = null;

document.getElementById('send-moder').addEventListener('click', async () => {
	console.log('button clicked')
	const post_img = document.getElementById('img-input')
	const title = document.getElementById('title-id')
	const content = document.querySelector('.ql-editor')
	const theme = document.querySelector('.theme-cont')
	const cut_img = document.getElementById('cut-img')
	console.log('0001', post_img)

	
	console.log('2', selectedFile)

	const formData = new FormData()
	formData.append('wrapp_img', selectedFile)
	formData.append('cut_img', cut_img.src)
	formData.append('title', title.value)
	formData.append('content', content.innerHTML)
	formData.append('theme', theme.textContent)

	const request = await fetch(`http://127.0.0.1:8000/home/add_post/`, {
		method: 'POST',
		headers: {
			'X-CSRFToken': csrfToken,
		},
		body: formData
	})
	console.log('POST requested')
	const response = await request.json()
	if (response.status === 'ok') {
		console.log('status ok')
		window.location.href = '/'
	} else {
		console.log(response.errors)
	}
})

document.addEventListener('DOMContentLoaded', () => {
	const themeCont = document.querySelector('.theme-cont') 
	themeCont.addEventListener('click', () => {
		const themeBtn = document.querySelector('.themes')
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
		console.log('first e: ', e)
	})

	dragArea.addEventListener('click', () => {
		imgInput.click()
	})

	imgInput.addEventListener('change', (e) => {
		const file = e.target.files[0]
		if (!(file.name.endsWith('jpg') || file.name.endsWith('png') || file.name.endsWith('jpeg'))) {
			imgPreview.removeAttribute('src')
			console.log('Delete click')
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
			console.log('1', files)
			selectedFile = files[0]
		} else {
			console.log('file not detected')
		}
	})

	function handleFile(file) {
		console.log('file::', file)
		if (!(file.name.endsWith('jpg') || file.name.endsWith('png') || file.name.endsWith('jpeg'))) {
			wrongFormat.style.display = 'flex'
		} else {
			const reader = new FileReader()
			reader.onload = function(e) {
			imgPreview.src = e.target.result
		}
		reader.readAsDataURL(file);
		imgPreview.style.display = 'block'
		console.log(`IMG PREVIEW: ${imgPreview.value}`)
		imgInput.style.display = 'none'
		deleteImg.style.display = 'flex'
		console.log('del img', deleteImg)
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
			console.log('Удалили атрибут')
			
		} else {
			reader.readAsDataURL(e.target.files[0])
			console.log(e.target.files[0])
			document.querySelector('.preview').style.display = 'none'
			imgAndDelete.style.display = 'flex'
			document.getElementById('img-preview').style.display = 'flex'
			deleteImg.style.display = 'flex'
		}

	})

	deleteImg.addEventListener('click', () => {
		console.log('clicked')
		imgPreview.removeAttribute('src')
		imgPreview.style.display = 'none'
		document.querySelector('.preview').style.display = 'flex'
		deleteImg.style.display = 'none'
		// imgInput.style.display = 'flex'
		imgInput.value = ''
		wrongFormat.style.display = 'none'
		console.log('img inpt', imgInput)
	})
})





