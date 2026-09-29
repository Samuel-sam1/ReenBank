/* =========================================
   REEN BANK - profile.js
   ========================================= */

// Helper to format currency
function formatCurrency(amount) {
  return '₦ ' + amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// 1. Load User Data (Header and Profile Card)
function loadProfileData() {
  const storedUser = JSON.parse(localStorage.getItem('reenUser'));
  const isLoggedIn = localStorage.getItem('reenLoggedIn');

  // Security check: Send to login if no active session
  if (!isLoggedIn || !storedUser) {
    window.location.replace("login.html");
    return;
  }

  // Update Header Elements
  const headerName = document.getElementById('display-user-name');
  const headerAccount = document.getElementById('display-user-account');
  if (headerName) headerName.textContent = storedUser.name;
  if (headerAccount) headerAccount.textContent = storedUser.accountNumber;

  // Update Profile Card Elements
  const profileName = document.getElementById('profile-name-main');
  const profileEmail = document.getElementById('profile-email-main');
  if (profileName) profileName.textContent = storedUser.name;
  if (profileEmail) profileEmail.textContent = storedUser.email;
}

// 2. Load Main Account Balance from Bank State
let bankState;
try {
  bankState = JSON.parse(localStorage.getItem('reenBankState'));
} catch (e) {
  bankState = null;
}

function renderMainAccount() {
  if (!bankState || !bankState.accounts) return;

  // Find specifically the "main" account
  const mainAccount = bankState.accounts.find(a => a.id === 'main');
  if (!mainAccount) return;

  const balanceElement = document.getElementById('main-account-balance');
  const eyeIcon = document.getElementById('main-eye-icon');

  if (balanceElement && eyeIcon) {
    // Determine visibility state
    balanceElement.textContent = mainAccount.hidden ? '₦ * * * * *' : formatCurrency(mainAccount.balance);
    
    // Update Eye Icon
    eyeIcon.setAttribute('data-lucide', mainAccount.hidden ? 'eye-off' : 'eye');
    
    // Refresh Icon
    if (typeof lucide !== 'undefined') {
      lucide.createIcons({ attrs: { class: ["w-5", "h-5"] }, nameAttr: 'data-lucide' });
    }
  }
}

// 3. Toggle Visibility for Main Account
window.toggleMainVisibility = function() {
  if (!bankState || !bankState.accounts) return;
  const mainAccount = bankState.accounts.find(a => a.id === 'main');
  
  if (mainAccount) {
    mainAccount.hidden = !mainAccount.hidden;
    localStorage.setItem('reenBankState', JSON.stringify(bankState));
    renderMainAccount();
  }
};

// 4. Render Recent Transactions List
function renderRecentTransactions() {
  if (!bankState || !bankState.transactions) return;

  const container = document.getElementById('profile-transactions-list');
  if (!container) return;

  container.innerHTML = '';

  if (bankState.transactions.length === 0) {
    container.innerHTML = `
      <div class="text-gray-400 text-sm text-center py-6">
        No recent transactions found.
      </div>
    `;
    return;
  }

  // Get latest 7 transactions
  const recentTx = [...bankState.transactions].reverse().slice(0, 7);

  recentTx.forEach(tx => {
    // Find account name
    const matchedAccount = bankState.accounts.find(a => a.id === tx.accountId);
    const accName = matchedAccount ? matchedAccount.name : "System";

    const isCredit = tx.type === 'credit';
    const amountColor = isCredit ? 'text-[#19B66B]' : 'text-red-500';
    const amountPrefix = isCredit ? '+' : '- ';
    
    const rowHTML = `
      <div class=" searchable-tx flex justify-between items-center border-b border-gray-100 pb-3 hover:bg-gray-50 rounded transition-colors">
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-500 font-medium truncate">${accName}</p>
        </div>
        <p class="text-xs text-gray-400 w-32 text-center">${tx.date}</p>
        <p class="${amountColor} font-bold text-sm w-28 text-right">${amountPrefix}${tx.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', rowHTML);
  });
}

// 5. Initialize on Load
window.addEventListener('DOMContentLoaded', () => {
  loadProfileData();
  renderMainAccount();
  renderRecentTransactions();

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

/* =========================================
   PASSWORD RESET LOGIC
   ========================================= */

// Get Elements
const resetPwdBtn = document.getElementById('reset-password-btn');
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
if (resetPwdBtn) {
  resetPwdBtn.addEventListener('click', () => {
    // Reset the modal back to step 1 every time it opens
    step1.classList.remove('hidden');
    step2.classList.add('hidden');
    emailInput.value = '';
    newPwdInput.value = '';
    confirmPwdInput.value = '';
    emailError.classList.add('hidden');
    pwdError.classList.add('hidden');
    
    // Show modal
    resetModal.classList.remove('hidden');
  });
}

// 2. Close Modal
closeResetBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    resetModal.classList.add('hidden');
  });
});

// 3. Verify Email (Step 1 -> Step 2)
if (verifyBtn) {
  verifyBtn.addEventListener('click', () => {
    const enteredEmail = emailInput.value.trim().toLowerCase();
    
    // Get the user data from localStorage (saved by your register.js)
    const storedUser = JSON.parse(localStorage.getItem('reenUser'));
    
    if (storedUser && storedUser.email.toLowerCase() === enteredEmail) {
      // Success! Hide error, hide step 1, show step 2
      emailError.classList.add('hidden');
      step1.classList.add('hidden');
      step2.classList.remove('hidden');
    } else {
      // Fail! Show error
      emailError.classList.remove('hidden');
      emailError.textContent = "The email entered is incorrect. Please try again.";
    }
  });
}

// 4. Save New Password (Finish)
if (savePwdBtn) {
  savePwdBtn.addEventListener('click', () => {
    const newPwd = newPwdInput.value;
    const confirmPwd = confirmPwdInput.value;
    
    // Check if empty
    if (!newPwd || !confirmPwd) {
      pwdError.textContent = "Please fill in both password fields.";
      pwdError.classList.remove('hidden');
      return;
    }

    // Check if passwords match
    if (newPwd !== confirmPwd) {
      pwdError.textContent = "Passwords do not match.";
      pwdError.classList.remove('hidden');
      return;
    }

    // Passwords match! Update the local storage
    const storedUser = JSON.parse(localStorage.getItem('reenUser'));
    if (storedUser) {
      storedUser.password = newPwd; // Update password
      localStorage.setItem('reenUser', JSON.stringify(storedUser)); // Save back
      
      // Close the reset modal
      resetModal.classList.add('hidden');
      
      // Open the Success Modal instead of the alert
      const successModal = document.getElementById('successPwdModal');
      if (successModal) {
        successModal.classList.remove('hidden');
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    }
  });
}

// Function to close the Success Modal
window.closeSuccessPwdModal = function() {
  const modal = document.getElementById('successPwdModal');
  if (modal) {
    modal.classList.add('hidden');
  }
};

// 5. Toggle Password Visibility
const togglePwdBtns = document.querySelectorAll('.toggle-pwd-btn');

togglePwdBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Get the ID of the input this button controls
    const targetId = btn.getAttribute('data-target');
    const targetInput = document.getElementById(targetId);
    const icon = btn.querySelector('i');
    
    // Toggle the type and the icon
    if (targetInput.type === 'password') {
      targetInput.type = 'text';
      icon.setAttribute('data-lucide', 'eye-off');
    } else {
      targetInput.type = 'password';
      icon.setAttribute('data-lucide', 'eye');
    }
    
    // Re-render the Lucide icons so the change shows up
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  });
});

/* =========================================
   GENDER DROPDOWN PERSISTENCE
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
  const genderSelect = document.getElementById('profile-gender');

  if (genderSelect) {
    // 1. Load the saved gender from localStorage (if it exists)
    const storedUser = JSON.parse(localStorage.getItem('reenUser'));
    
    if (storedUser && storedUser.gender) {
      genderSelect.value = storedUser.gender;
    }

    // 2. Listen for changes and save to localStorage immediately
    genderSelect.addEventListener('change', (event) => {
      if (storedUser) {
        storedUser.gender = event.target.value;
        localStorage.setItem('reenUser', JSON.stringify(storedUser));
      }
    });
  }
});