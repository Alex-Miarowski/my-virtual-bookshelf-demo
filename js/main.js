let bookSearchBtn
let booksPanel
let checkboxFreeToRead
let filtersBtn
let filtersPanel
let searchOptions

const main = () => {
	prepareDOMElements()
	prepareDOMEvents()
}

const prepareDOMElements = () => {
	bookSearchBtn = document.querySelector('button#book-search-panel__btn-search')
	booksPanel = document.querySelector('section.books-panel')
	checkboxFreeToRead = document.querySelector('input#book-search-panel__checkbox-free-to-read')
	filtersBtn = document.querySelector('button#book-search-panel__btn-filters')
	filtersPanel = document.querySelector('div.book-search-panel__filters-panel')
	filtersPanel.style.display = 'none'
}

const prepareDOMEvents = () => {
	bookSearchBtn.addEventListener('click', bookSearchBtnClick)
	filtersBtn.addEventListener('click', filtersBtnClick)
}

async function bookSearchBtnClick() {
	booksPanel.innerHTML = ''
	let inputBookTitle = document.querySelector('input#book-search-panel__input-title').value

	checkSearchOptions()

	if (!((searchOptions.trim() == '' || searchOptions.trim() == '&filter=full') && inputBookTitle.trim() == '')) {
		inputBookTitle.replace(' ', '+')
		await fetch(`https://www.googleapis.com/books/v1/volumes?q=${inputBookTitle}+${searchOptions}`)
			.then(res => {
				if (res.ok) {
					return res.json()
				} else {
					throw new Error(`Http error: ${res.status}`)
				}
			})
			.then(res => {
				if (res.totalItems > 0) {
					for (let i = 0; i < res.items.length; i++) {
						let item = res.items[i]
						createBookCard(item)
					}
				} else {
					console.log('Book not found')
				}
			})
			.catch(err => console.error(err))
	}
}

function checkSearchOptions() {
	searchOptions = ''
	let inputBookAuthor = document.querySelector('input#book-search-panel__input-author').value.replace(' ', '+')

	if (inputBookAuthor !== '') {
		searchOptions += `+inauthor:${inputBookAuthor}`
	}

	if (checkboxFreeToRead.checked) {
		searchOptions += '&filter=full'
	}
}

function createBookCard(item) {
	let bookElement = document.createElement('div')
	bookElement.classList.add('books-panel__book-element')

	let bookCardDiv = document.createElement('div')
	bookCardDiv.classList.add('books-panel__book-card')

	let bookDetailsDiv = document.createElement('div')
	bookDetailsDiv.classList.add('books-panel__book-details')

	let bookImg = document.createElement('img')
	let bookImgLink
	if (item.volumeInfo.hasOwnProperty('imageLinks')) {
		bookImgLink = item.volumeInfo.imageLinks.smallThumbnail
	} else {
		bookImgLink = './img/book-pic-not-found.jpg'
	}
	bookImg.setAttribute('src', bookImgLink)
	bookImg.setAttribute('alt', 'book cover image')
	bookImg.classList.add('books-panel__book-img')

	let bookTitleP = document.createElement('p')
	bookTitleP.textContent = item.volumeInfo.title
	bookTitleP.classList.add('books-panel__book-title')

	let bookAuthorsP = document.createElement('p')
	bookAuthorsP.textContent = item.volumeInfo.authors

	let bookPublishedDateP = document.createElement('p')
	bookPublishedDateP.textContent = item.volumeInfo.publishedDate

	bookDetailsDiv.append(bookTitleP, bookAuthorsP, bookPublishedDateP)

	let bookPublisherP = document.createElement('p')
	bookPublisherP.textContent = item.volumeInfo.publisher
	if (bookPublisherP.textContent != '') {
		bookDetailsDiv.appendChild(bookPublisherP)
	}

	if (item.accessInfo.viewability == 'ALL_PAGES') {
		let bookPreviewLink = document.createElement('a')
		bookPreviewLink.textContent = 'Read'
		bookPreviewLink.setAttribute('href', item.accessInfo.webReaderLink)
		bookPreviewLink.classList.add('books-panel__book-preview-link')
		bookDetailsDiv.append(bookPreviewLink)
	}

	let shelfDiv = document.createElement('div')
	shelfDiv.classList.add('books-panel__shelf')

	bookCardDiv.append(bookImg, bookDetailsDiv)
	bookElement.append(bookCardDiv, shelfDiv)
	booksPanel.append(bookElement)
}

function filtersBtnClick() {
	if (filtersPanel.style.display == 'none') {
		filtersPanel.style.display = 'flex'
	} else {
		filtersPanel.style.display = 'none'
	}
}

main()
