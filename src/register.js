// LOCAL STORAGE KEY
const USER_KEY = "reenUser";
const LOGIN_KEY = "reenLoggedIn";
// GET ELEMENTS
const registerForm = document.getElementById("register-form");
const otpForm = document.getElementById("otp-form");
const registerScreen = document.getElementById("register-screen");
const otpScreen = document.getElementById("otp-screen");
const otpEmail = document.getElementById("otp-email");
const otpInputs = document.querySelectorAll(".otp-input");
const togglePassword = document.getElementById("toggle-password");
const passwordInput = document.getElementById("password");
// GENERATE RANDOM 6 DIGIT OTP

function generateAccountNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}
// REGISTER USER
registerForm.addEventListener("submit", function (event) {
  event.preventDefault();
  // Get form values
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value;

const existingUser = JSON.parse(localStorage.getItem(USER_KEY));
  if (
    existingUser && existingUser.email.toLowerCase() === email.toLowerCase()
  ) {
    showOTPModal(
      "Account already exists",
      "An account with this email already exists. Please login instead.",
      "account-exists"
    );
    return;
  }

  // Create user object
  const user = {
    name: name,
    email: email,
    password: password,
    accountNumber: generateAccountNumber(),
    // User has not verified email yet
    verified: false
  };
  // Save user to localStorage
  localStorage.setItem(
    USER_KEY,
    JSON.stringify(user)
  );
  // Put email inside OTP message
  otpEmail.textContent = email;
  // Hide registration
  registerScreen.classList.add("hidden");
  // Show OTP
  otpScreen.classList.remove("hidden");
  // Put cursor in first OTP box
  otpInputs[0].focus();
 
  // Re-render Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }
});
// OTP INPUT
// Automatically moves to next box
otpInputs.forEach((input, index) => {
  input.addEventListener("input", function () {
    // Only allow numbers
    input.value = input.value.replace(/\D/g, "");
    // Move to next input
    if (
      input.value &&
      index < otpInputs.length - 1
    ) {
      otpInputs[index + 1].focus();
    }
  });
  // Backspace moves to previous box
  input.addEventListener("keydown", function (event) {
    if (
      event.key === "Backspace" &&
      !input.value &&
      index > 0
    ) {
      otpInputs[index - 1].focus();
    }
  });
});



// VERIFY OTP
// =====================================================
otpForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const enteredOTP = Array.from(otpInputs)
    .map(input => input.value)
    .join("");
  // Must contain exactly 6 digits
  if (!/^\d{6}$/.test(enteredOTP)) {
    showOTPModal(
      "Invalid OTP",
      "Please enter all 6 digits of your verification code.",
      "error"
    );
    return;
  }
  const user = JSON.parse(localStorage.getItem(USER_KEY));
  if (!user) {
    showOTPModal(
      "Account not found",
      "We could not find your registered account.",
      "error"
    );
    return;
  }
  // Any 6 digits are accepted
  user.verified = true;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(LOGIN_KEY, "true");
  showOTPModal(
    "OTP verified successfully",
    "Your account has been verified. Proceed to your dashboard.",
    "success"
  );
});

// RESEND OTP
document.getElementById("resend-otp").addEventListener("click", function () {
    alert("A new OTP has been generated.");
  });

// SHOW / HIDE PASSWORD
togglePassword.addEventListener(
  "click",
  function () {
    const isPassword =
      passwordInput.type === "password";
    passwordInput.type =
      isPassword
        ? "text"
        : "password";
    const icon =
      togglePassword.querySelector("i");
    if (icon) {
      icon.setAttribute(
        "data-lucide",
        isPassword
          ? "eye-off"
          : "eye"
      );
      lucide.createIcons();
    }
  }
);
// OTP MODAL
const otpModal = document.getElementById("otp-modal");
const otpModalTitle = document.getElementById("otp-modal-title");
const otpModalMessage = document.getElementById("otp-modal-message");
const otpModalButton = document.getElementById("otp-modal-button");
const otpModalIcon = document.getElementById("otp-modal-icon");
const otpModalIconWrapper = document.getElementById("otp-modal-icon-wrapper");
// SHOW OTP MODAL
function showOTPModal( title, message, type = "success") {
  otpModalTitle.textContent = title;
  otpModalMessage.textContent = message;
  if (type === "success") {
    otpModalIcon.setAttribute("data-lucide","check");
    otpModalIcon.className ="w-8 h-8 text-reen-green";
    otpModalIconWrapper.className ="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-reen-green/10";
    otpModalButton.textContent =  "Proceed to Dashboard";
      otpModalButton.dataset.action = "dashboard";
  }  else if (type === "account-exists") {
    otpModalIcon.setAttribute("data-lucide", "circle-alert");
    otpModalIcon.className = "w-8 h-8 text-red-500";
    otpModalIconWrapper.className = "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10";
    otpModalButton.textContent = "Login";
    // Existing account
    otpModalButton.dataset.action = "login";
   } else {
    otpModalIcon.setAttribute( "data-lucide", "circle-alert");
    otpModalIcon.className = "w-8 h-8 text-red-500";
    otpModalIconWrapper.className = "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10";
    otpModalButton.textContent = "Try Again";
      otpModalButton.dataset.action = "close";
  }
  // Show modal
  otpModal.classList.remove("hidden");
  // Re-render Lucide icon
  if (window.lucide) {
    lucide.createIcons();
  }
}
// OTP MODAL BUTTON
otpModalButton.addEventListener("click", function () {
  const action = otpModalButton.dataset.action;
  if (action === "dashboard") {
    window.location.replace("dashboard.html");
    return;
  }
  if (action === "login") {
    window.location.replace("login.html");
    return;
  }
  if (action === "close") {
    otpModal.classList.add("hidden");
  }
});