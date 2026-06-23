// ============================================
// FORM STATE MANAGEMENT
// ============================================

const formState = {
  firstName: '',
  lastName: '',
  email: '',
  queryType: null,
  message: '',
  consent: false
};

const formErrors = {
  firstName: '',
  lastName: '',
  email: '',
  queryType: '',
  message: '',
  consent: ''
};

let isSubmitting = false;

// ============================================
// DOM ELEMENTS
// ============================================

const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successToast = document.getElementById('successToast');

// Form inputs
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const queryTypeInputs = document.querySelectorAll('input[name="queryType"]');
const messageInput = document.getElementById('message');
const consentInput = document.getElementById('consent');

// Error message elements
const firstNameError = document.getElementById('firstName-error');
const lastNameError = document.getElementById('lastName-error');
const emailError = document.getElementById('email-error');
const queryTypeError = document.getElementById('queryType-error');
const messageError = document.getElementById('message-error');
const consentError = document.getElementById('consent-error');

// ============================================
// VALIDATION FUNCTIONS
// ============================================

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateForm() {
  const errors = {};
  
  // First Name validation
  if (!formState.firstName.trim()) {
    errors.firstName = 'This field is required';
  }
  
  // Last Name validation
  if (!formState.lastName.trim()) {
    errors.lastName = 'This field is required';
  }
  
  // Email validation
  if (!formState.email.trim()) {
    errors.email = 'This field is required';
  } else if (!validateEmail(formState.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Query Type validation
  if (!formState.queryType) {
    errors.queryType = 'Please select a query type';
  }
  
  // Message validation
  if (!formState.message.trim()) {
    errors.message = 'This field is required';
  }
  
  // Consent validation
  if (!formState.consent) {
    errors.consent = 'To submit this form, please consent to being contacted';
  }
  
  return errors;
}

// ============================================
// ERROR DISPLAY FUNCTIONS
// ============================================

function showError(inputElement, errorElement, errorMessage) {
  // Add error class to input
  inputElement.classList.add('error');
  
  // Set ARIA attributes
  inputElement.setAttribute('aria-invalid', 'true');
  inputElement.setAttribute('aria-describedby', errorElement.id);
  
  // Show error message with animation
  errorElement.textContent = errorMessage;
  errorElement.classList.add('show');
}

function clearError(inputElement, errorElement) {
  // Remove error class from input
  inputElement.classList.remove('error');
  
  // Remove ARIA attributes
  inputElement.removeAttribute('aria-invalid');
  inputElement.removeAttribute('aria-describedby');
  
  // Hide error message
  errorElement.classList.remove('show');
  setTimeout(() => {
    if (!errorElement.classList.contains('show')) {
      errorElement.textContent = '';
    }
  }, 200);
}

function clearAllErrors() {
  clearError(firstNameInput, firstNameError);
  clearError(lastNameInput, lastNameError);
  clearError(emailInput, emailError);
  clearError(messageInput, messageError);
  clearError(consentInput, consentError);
  
  // Clear query type error
  queryTypeError.classList.remove('show');
  setTimeout(() => {
    if (!queryTypeError.classList.contains('show')) {
      queryTypeError.textContent = '';
    }
  }, 200);
}

function displayErrors(errors) {
  // Clear all errors first
  clearAllErrors();
  
  // Display new errors
  if (errors.firstName) {
    showError(firstNameInput, firstNameError, errors.firstName);
  }
  
  if (errors.lastName) {
    showError(lastNameInput, lastNameError, errors.lastName);
  }
  
  if (errors.email) {
    showError(emailInput, emailError, errors.email);
  }
  
  if (errors.queryType) {
    queryTypeError.textContent = errors.queryType;
    queryTypeError.classList.add('show');
    // Add aria-describedby to fieldset
    const fieldset = document.querySelector('fieldset');
    fieldset.setAttribute('aria-describedby', 'queryType-error');
  }
  
  if (errors.message) {
    showError(messageInput, messageError, errors.message);
  }
  
  if (errors.consent) {
    showError(consentInput, consentError, errors.consent);
  }
}

// ============================================
// SUCCESS TOAST FUNCTIONS
// ============================================

function showSuccessToast() {
  successToast.removeAttribute('hidden');
  // Trigger animation after a small delay
  setTimeout(() => {
    successToast.classList.add('show');
  }, 10);
  
  // Hide toast after 5 seconds
  setTimeout(() => {
    hideSuccessToast();
  }, 5000);
}

function hideSuccessToast() {
  successToast.classList.remove('show');
  setTimeout(() => {
    successToast.setAttribute('hidden', '');
  }, 300);
}

// ============================================
// FORM SUBMISSION
// ============================================

function handleSubmit(e) {
  e.preventDefault();
  
  // Validate form
  const errors = validateForm();
  
  // If there are errors, display them and stop
  if (Object.keys(errors).length > 0) {
    displayErrors(errors);
    // Focus on first error
    const firstErrorField = Object.keys(errors)[0];
    const fieldMap = {
      firstName: firstNameInput,
      lastName: lastNameInput,
      email: emailInput,
      queryType: queryTypeInputs[0],
      message: messageInput,
      consent: consentInput
    };
    fieldMap[firstErrorField]?.focus();
    return;
  }
  
  // Clear any existing errors
  clearAllErrors();
  
  // Start submission
  isSubmitting = true;
  submitBtn.disabled = true;
  submitBtn.classList.add('loading');
  
  // Hide button text, show spinner
  const btnText = submitBtn.querySelector('.btn-text');
  const spinner = submitBtn.querySelector('.loading-spinner');
  btnText.style.display = 'none';
  spinner.removeAttribute('hidden');
  
  // Simulate network request (1.2 seconds)
  setTimeout(() => {
    // Submission successful
    isSubmitting = false;
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    
    // Restore button
    btnText.style.display = 'inline';
    spinner.setAttribute('hidden', '');
    
    // Show success toast
    showSuccessToast();
    
    // Reset form after showing toast
    setTimeout(() => {
      resetForm();
    }, 5000);
  }, 1200);
}

// ============================================
// FORM RESET
// ============================================

function resetForm() {
  // Reset form state
  formState.firstName = '';
  formState.lastName = '';
  formState.email = '';
  formState.queryType = null;
  formState.message = '';
  formState.consent = false;
  
  // Reset form inputs
  form.reset();
  
  // Remove selected class from radio labels
  document.querySelectorAll('.radio-label').forEach(label => {
    label.classList.remove('selected');
  });
  
  // Clear any errors
  clearAllErrors();
}

// ============================================
// INPUT CHANGE HANDLERS
// ============================================

function handleInputChange(e) {
  const { name, value, type, checked } = e.target;
  
  // Update form state
  if (type === 'checkbox') {
    formState[name] = checked;
  } else {
    formState[name] = value;
  }
  
  // Clear error for this field when user starts typing
  const errorMap = {
    firstName: { input: firstNameInput, error: firstNameError },
    lastName: { input: lastNameInput, error: lastNameError },
    email: { input: emailInput, error: emailError },
    message: { input: messageInput, error: messageError },
    consent: { input: consentInput, error: consentError }
  };
  
  if (errorMap[name]) {
    clearError(errorMap[name].input, errorMap[name].error);
  }
}

function handleRadioChange(e) {
  const value = e.target.value;
  
  // Update form state
  formState.queryType = value;
  
  // Update selected class on labels
  document.querySelectorAll('.radio-label').forEach(label => {
    label.classList.remove('selected');
  });
  e.target.closest('.radio-label').classList.add('selected');
  
  // Clear query type error
  queryTypeError.classList.remove('show');
  setTimeout(() => {
    if (!queryTypeError.classList.contains('show')) {
      queryTypeError.textContent = '';
    }
  }, 200);
}

// ============================================
// EVENT LISTENERS
// ============================================

// Form submission
form.addEventListener('submit', handleSubmit);

// Input changes
firstNameInput.addEventListener('input', handleInputChange);
lastNameInput.addEventListener('input', handleInputChange);
emailInput.addEventListener('input', handleInputChange);
messageInput.addEventListener('input', handleInputChange);
consentInput.addEventListener('change', handleInputChange);

// Radio button changes
queryTypeInputs.forEach(radio => {
  radio.addEventListener('change', handleRadioChange);
});

// ============================================
// KEYBOARD ACCESSIBILITY FOR CUSTOM CONTROLS
// ============================================

// Handle Enter/Space key on radio labels
document.querySelectorAll('.radio-label').forEach(label => {
  label.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const radio = label.querySelector('.radio-input');
      radio.checked = true;
      radio.dispatchEvent(new Event('change'));
    }
  });
});

// Handle Enter/Space key on checkbox label
document.querySelector('.checkbox-label').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    consentInput.checked = !consentInput.checked;
    consentInput.dispatchEvent(new Event('change'));
  }
});

// ============================================
// INITIAL SETUP
// ============================================

// Remove animation classes after page load for better performance
window.addEventListener('load', () => {
  // Page is fully loaded, animations have played
  console.log('Contact form ready! 🚀');
});

// Focus management - ensure keyboard users can navigate
firstNameInput.focus();
