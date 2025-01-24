// Get form elements
const form = document.querySelector("form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const passwordConfirmInput = document.getElementById("password-confirm");

// Create error message elements
function createErrorElement(id) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.id = id;
  return errorDiv;
}

// Add error message elements after each input
const nameError = createErrorElement("name-error");
const emailError = createErrorElement("email-error");
const passwordError = createErrorElement("password-error");
const passwordConfirmError = createErrorElement("password-confirm-error");

nameInput.parentNode.appendChild(nameError);
emailInput.parentNode.appendChild(emailError);
passwordInput.parentNode.appendChild(passwordError);
passwordConfirmInput.parentNode.appendChild(passwordConfirmError);

// Add CSS for error messages
const style = document.createElement("style");
style.textContent = `
    .error-message {
        color: #d32f2f;
        font-size: 12px;
        margin-top: 4px;
        min-height: 16px;
    }
    
    .error {
        border-color: #d32f2f !important;
    }
    
    .success {
        border-color: #2e7d32 !important;
    }
`;
document.head.appendChild(style);

// Validation functions
function validateName(name) {
  const nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)+$/;
  return nameRegex.test(name.trim());
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

function validatePassword(password) {
  return password.length >= 6;
}

// Real-time validation
nameInput.addEventListener("input", () => {
  const name = nameInput.value;
  if (!name) {
    nameError.textContent = "Name is required";
    nameInput.classList.add("error");
    nameInput.classList.remove("success");
  } else if (!validateName(name)) {
    nameError.textContent = "Please enter your first and last name";
    nameInput.classList.add("error");
    nameInput.classList.remove("success");
  } else {
    nameError.textContent = "";
    nameInput.classList.remove("error");
    nameInput.classList.add("success");
  }
});

emailInput.addEventListener("input", () => {
  const email = emailInput.value;
  if (!email) {
    emailError.textContent = "Email is required";
    emailInput.classList.add("error");
    emailInput.classList.remove("success");
  } else if (!validateEmail(email)) {
    emailError.textContent = "Please enter a valid email address";
    emailInput.classList.add("error");
    emailInput.classList.remove("success");
  } else {
    emailError.textContent = "";
    emailInput.classList.remove("error");
    emailInput.classList.add("success");
  }
});

passwordInput.addEventListener("input", () => {
  const password = passwordInput.value;
  if (!password) {
    passwordError.textContent = "Password is required";
    passwordInput.classList.add("error");
    passwordInput.classList.remove("success");
  } else if (!validatePassword(password)) {
    passwordError.textContent = "Password must be at least 6 characters";
    passwordInput.classList.add("error");
    passwordInput.classList.remove("success");
  } else {
    passwordError.textContent = "";
    passwordInput.classList.remove("error");
    passwordInput.classList.add("success");
  }

  // Check password confirmation match if it has a value
  if (passwordConfirmInput.value) {
    checkPasswordsMatch();
  }
});

function checkPasswordsMatch() {
  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;

  if (!passwordConfirm) {
    passwordConfirmError.textContent = "Please confirm your password";
    passwordConfirmInput.classList.add("error");
    passwordConfirmInput.classList.remove("success");
  } else if (password !== passwordConfirm) {
    passwordConfirmError.textContent = "Passwords do not match";
    passwordConfirmInput.classList.add("error");
    passwordConfirmInput.classList.remove("success");
  } else {
    passwordConfirmError.textContent = "";
    passwordConfirmInput.classList.remove("error");
    passwordConfirmInput.classList.add("success");
  }
}

passwordConfirmInput.addEventListener("input", checkPasswordsMatch);

// Form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Trigger all validations
  nameInput.dispatchEvent(new Event("input"));
  emailInput.dispatchEvent(new Event("input"));
  passwordInput.dispatchEvent(new Event("input"));
  checkPasswordsMatch();

  // Check if there are any errors
  const hasErrors = document.querySelectorAll(".error").length > 0;

  if (!hasErrors) {
    // Create object with form data
    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
    };

    console.log("Form submitted successfully:", formData);
    // Here you would typically send the data to your server

    // Optional: Clear form after successful submission
    form.reset();
    document
      .querySelectorAll(".success")
      .forEach((el) => el.classList.remove("success"));
  }
});
