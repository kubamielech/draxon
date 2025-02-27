const contactInputs = document.querySelectorAll('.contact__form-input')
const contactTextArea = document.querySelector('.contact__form-text')
const contactLabels = document.querySelectorAll('.contact__form-label')
const sendBtn = document.querySelector('.contact__form-btn')
const agreement = document.querySelector('#privacy') // Checkbox zgody na przetwarzanie danych

// Funkcja do pokazywania błędu
const showError = input => {
	const formBox = input.closest('.contact__form-item') // Zamiast parentElement, użyj closest, by znaleźć najbliższy element o klasie contact__form-item
	formBox.classList.add('contact_error')
	formBox.querySelector('.contact__error').style.display = 'block' // Pokazuje komunikat błędu
}

// Funkcja do czyszczenia błędu
const clearError = input => {
	const formBox = input.closest('.contact__form-item')
	formBox.classList.remove('contact_error')
	formBox.querySelector('.contact__error').style.display = 'none' // Ukrywa komunikat błędu
}

// Walidacja emaila
const isEmailValid = email => {
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailPattern.test(email)
}

// Funkcja walidująca formularz
const checkForm = inputs => {
	let isValid = true

	// Walidacja pól tekstowych
	inputs.forEach(el => {
		if (el.value.trim() === '') {
			showError(el)
			isValid = false
		} else {
			clearError(el)
		}
	})

	// Walidacja emaila
	const emailInput = document.querySelector('#email')
	if (!isEmailValid(emailInput.value)) {
		showError(emailInput)
		isValid = false
	} else {
		clearError(emailInput)
	}

	// Sprawdzenie checkboxa zgody
	if (!agreement.checked) {
		showError(agreement) // Dodajemy błąd dla checkboxa
		isValid = false
	} else {
		clearError(agreement) // Usuwamy błąd dla checkboxa
	}

	// Walidacja reCAPTCHA
	const recaptchaResponse = grecaptcha.getResponse()
	if (recaptchaResponse === '') {
		document.querySelector('.contact__error--special').style.display = 'block' // Pokazuje błąd dla reCAPTCHA
		isValid = false
	} else {
		document.querySelector('.contact__error--special').style.display = 'none' // Ukrywa błąd dla reCAPTCHA
	}

	return isValid
}

// Obsługa etykiet przy polach
const handleLabel = e => {
	const label = e.target.nextElementSibling // Zakładam, że label jest po input
	if (e.type === 'focus' || e.target.value !== '') {
		label.classList.add('contact__form-label--active')
	} else {
		label.classList.remove('contact__form-label--active')
	}
}

// Obsługa kliknięcia przycisku wysyłania
sendBtn.addEventListener('click', e => {
	e.preventDefault()

	const isFormValid = checkForm([
		document.querySelector('#name'),
		document.querySelector('#email'),
		document.querySelector('#msg'),
	])

	if (isFormValid) {
		e.target.closest('form').submit() // Wysłanie formularza, jeśli wszystko jest OK
	}
})

// Obsługa aktywacji etykiet (label)
contactInputs.forEach(contactInput => contactInput.addEventListener('focus', handleLabel))
contactInputs.forEach(contactInput => contactInput.addEventListener('focusout', handleLabel))
contactTextArea.addEventListener('focus', handleLabel)
contactTextArea.addEventListener('focusout', handleLabel)
