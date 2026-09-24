const USER_KEY = "reenUser";
const LOGIN_KEY = "reenLoggedIn";
// GET ELEMENTS
const loginForm =  document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("toggle-password");
// MODAL ELEMENTS
const loginModal = document.getElementById("login-modal");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const modalButton = document.getElementById("modal-button");
const modalIcon = document.getElementById("modal-icon");
const modalIconWrapper = document.getElementById("modal-icon-wrapper");
// SHOW MODAL
function showModal(title, message, type = "success") {
  modalTitle.textContent = title;
  modalMessage.textContent = message;

  if (type === "success") {
    modalIcon.setAttribute("data-lucide", "check");
    modalIcon.className = "w-8 h-8 text-reen-green";
    modalIconWrapper.className =
      "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-reen-green/10";
    modalButton.textContent = "Continue";

    // Tell the button this is a successful login
    modalButton.dataset.action = "dashboard";

  } else {
    modalIcon.setAttribute("data-lucide", "circle-alert");
    modalIcon.className = "w-8 h-8 text-red-500";
    modalIconWrapper.className =
      "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10";

    modalButton.textContent = "Try Again";
    // Tell the button this is an error
    modalButton.dataset.action = "close";
  }
  loginModal.classList.remove("hidden");
  if (window.lucide) {
    lucide.createIcons();
  }
}
// CLOSE MODAL
modalButton.addEventListener("click", function () {
  if (modalButton.dataset.action === "dashboard") {
    window.location.replace("dashboard.html");
  } else {
    loginModal.classList.add("hidden");
  }
});
// LOGIN
loginForm.addEventListener(
  "submit",
  function (event) {
    event.preventDefault();
    // Get input values
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    // Get saved user
    const savedUser = JSON.parse(localStorage.getItem(USER_KEY));
    // NO USER
    if (!savedUser) {
      showModal(
        "Account not found",
        "No registered account was found. Please create an account first.",
        "error"
      );
      return;
    }
    // CHECK EMAIL
    if (
      email.toLowerCase() !==
      savedUser.email.toLowerCase()
    ) {
      showModal(
        "Incorrect email",
        "The email address you entered does not match your registered account.",
        "error"
      );
      return;
    }
    // CHECK PASSWORD
    if ( password !== savedUser.password
    ) {
      showModal(
        "Incorrect password",
        "The password you entered is incorrect. Please try again.",
        "error"
      );
      return;
    }
    // CHECK OTP VERIFICATION
    if (!savedUser.verified) {
      showModal(
        "Account not verified",
        "Please complete the OTP verification before logging in.",
        "error"
      );
      return;
    }
    // LOGIN SUCCESS
    localStorage.setItem(
      LOGIN_KEY,
      "true"
    );
    showModal(
      "Login successful",
      `Welcome back, ${savedUser.name}! You are ready to access your banking dashboard.`,
      "success"
    );
  }
);
// SHOW / HIDE PASSWORD
togglePassword.addEventListener(
  "click",
  function () {
    const isPassword =
      passwordInput.type ===
      "password";
    passwordInput.type =
      isPassword
        ? "text"
        : "password";
    togglePassword
      .querySelector("i")
      .setAttribute(
        "data-lucide",
        isPassword
          ? "eye-off"
          : "eye"
      );
    if (window.lucide) {
      lucide.createIcons();
    }
  }
);