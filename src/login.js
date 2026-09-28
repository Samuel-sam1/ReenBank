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
    window.location.replace("account.html");
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

/* =========================================
   LOGIN PAGE - PASSWORD RESET LOGIC
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
  // Get Elements
  const resetLink = document.getElementById('login-reset-pwd-link');
  const resetModal = document.getElementById('reset-pwd-modal');
  const step1 = document.getElementById('reset-step-1');
  const step2 = document.getElementById('reset-step-2');
  const closeResetBtns = document.querySelectorAll('.close-reset-modal');

  // Step 1 Elements
  const emailInput = document.getElementById('reset-verify-email');
  const verifyBtn = document.getElementById('verify-email-btn');
  const emailError = document.getElementById('reset-email-error');

  // Step 2 Elements
  const newPwdInput = document.getElementById('new-password');
  const confirmPwdInput = document.getElementById('confirm-new-password');
  const savePwdBtn = document.getElementById('save-new-pwd-btn');
  const pwdError = document.getElementById('reset-pwd-error');

  // 1. Open Modal and reset state
  if (resetLink) {
    resetLink.addEventListener('click', (e) => {
      e.preventDefault();
      
      step1.classList.remove('hidden');
      step2.classList.add('hidden');
      emailInput.value = '';
      newPwdInput.value = '';
      confirmPwdInput.value = '';
      emailError.classList.add('hidden');
      pwdError.classList.add('hidden');
      
      // Reset eye icons
      newPwdInput.type = 'password';
      confirmPwdInput.type = 'password';
      document.querySelectorAll('.toggle-pwd-btn i').forEach(icon => {
        icon.setAttribute('data-lucide', 'eye');
      });
      if (typeof lucide !== 'undefined') lucide.createIcons();

      resetModal.classList.remove('hidden');
    });
  }

  // 2. Close Modal
  closeResetBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      resetModal.classList.add('hidden');
    });
  });

  // 3. Verify Email (Step 1 -> Step 2)
  if (verifyBtn) {
    verifyBtn.addEventListener('click', () => {
      const enteredEmail = emailInput.value.trim().toLowerCase();
      const storedUser = JSON.parse(localStorage.getItem('reenUser'));
      
      if (storedUser && storedUser.email.toLowerCase() === enteredEmail) {
        emailError.classList.add('hidden');
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
      } else {
        emailError.classList.remove('hidden');
        emailError.textContent = "The email entered is incorrect. Please try again.";
      }
    });
  }

  // 4. Save New Password
  if (savePwdBtn) {
    savePwdBtn.addEventListener('click', () => {
      const newPwd = newPwdInput.value;
      const confirmPwd = confirmPwdInput.value;
      
      if (!newPwd || !confirmPwd) {
        pwdError.textContent = "Please fill in both password fields.";
        pwdError.classList.remove('hidden');
        return;
      }

      if (newPwd !== confirmPwd) {
        pwdError.textContent = "Passwords do not match.";
        pwdError.classList.remove('hidden');
        return;
      }

      const storedUser = JSON.parse(localStorage.getItem('reenUser'));
      if (storedUser) {
        storedUser.password = newPwd;
        localStorage.setItem('reenUser', JSON.stringify(storedUser));
        
        resetModal.classList.add('hidden');
        
        setTimeout(() => {
          alert("Your password has been successfully updated! You can now log in.");
        }, 300);
      }
    });
  }

  // 5. Toggle Password Visibility inside the Modal
  const togglePwdBtns = document.querySelectorAll('.toggle-pwd-btn');
  togglePwdBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetInput = document.getElementById(targetId);
      const icon = btn.querySelector('i');
      
      if (targetInput.type === 'password') {
        targetInput.type = 'text';
        icon.setAttribute('data-lucide', 'eye-off');
      } else {
        targetInput.type = 'password';
        icon.setAttribute('data-lucide', 'eye');
      }
      
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  });
});