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