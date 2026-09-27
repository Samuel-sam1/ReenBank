/* =========================================
   REEN BANK - transactions.js
   ========================================= */

// 1. Default State (Mirrors account.js and overview.js)
const defaultState = {
  accounts: [
    { id: 'main', name: 'Main Account', balance: 0, hidden: false, theme: 'border-[#5645A5]' },
    { id: 'school', name: 'School Savings', balance: 0, hidden: false, theme: 'border-[#5645A5]' },
    { id: 'holiday', name: 'Holiday Plan', balance: 0, hidden: false, theme: 'border-transparent' }
  ],
  transactions: []
};

// 2. Load state from LocalStorage 
let bankState;
try {
  bankState = JSON.parse(localStorage.getItem('reenBankState')) || defaultState;
  if (!bankState.accounts) bankState = defaultState;
} catch (e) {
  bankState = defaultState;
}

// Helpers
function formatCurrency(amount) {
  return '₦ ' + amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// 3. Render the Account Summary Cards
function renderAccountSummaries() {
  const wrapper = document.getElementById('tx-accounts-wrapper');
  if (!wrapper) return;

  let html = '';

  bankState.accounts.forEach(acc => {
    // Determine visibility state
    const balanceDisplay = acc.hidden ? '₦ * * * * *' : formatCurrency(acc.balance);
    const eyeIcon = acc.hidden ? 'eye-off' : 'eye';
    
    // Summary card layout (No buttons, just title, balance, and eye icon)
    html += `
      <div class="bg-[#DDF7EE] rounded-2xl p-6 shadow-sm flex flex-col justify-center h-32 border-l-4 ${acc.theme}">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-[#5645A5] text-sm font-medium mb-1">${acc.name}</p>
            <p class="text-2xl font-bold text-gray-900">${balanceDisplay}</p>
          </div>
          <button onclick="toggleVisibility('${acc.id}')" class="cursor-pointer text-gray-400 hover:text-gray-700 transition-colors">
            <i data-lucide="${eyeIcon}" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  });

  wrapper.innerHTML = html;
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// 4. Toggle Visibility (Syncs across all pages)
window.toggleVisibility = function(accountId) {
  const account = bankState.accounts.find(a => a.id === accountId);
  if (account) {
    account.hidden = !account.hidden;
    localStorage.setItem('reenBankState', JSON.stringify(bankState));
    renderAccountSummaries(); 
  }
};

// 5. Render Full Transactions History
function renderFullTransactions() {
  const container = document.getElementById('tx-full-list');
  if (!container) return;

  container.innerHTML = ''; 

  if (bankState.transactions.length === 0) {
    container.innerHTML = `
      <div class="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
        <p>No transactions found in history.</p>
      </div>
    `;
    return;
  }

  // Show newest first
  const reversedTx = [...bankState.transactions].reverse();

  reversedTx.forEach(tx => {
    // Match account name
    const matchedAccount = bankState.accounts.find(a => a.id === tx.accountId);
    const accountNameDisplay = matchedAccount ? matchedAccount.name : "System";

    const isCredit = tx.type === 'credit';
    const iconBg = isCredit ? 'bg-[#19B66B]' : 'bg-[#FA6E6E]';
    const iconName = isCredit ? 'plus' : 'minus';
    const amountColor = isCredit ? 'text-[#19B66B]' : 'text-[#FA6E6E]';
    const amountPrefix = isCredit ? '+' : '- ';
    
    // Status Badge Logic (Default is completed, but supports pending/canceled if added later)
    let statusClass = "bg-[#2EB875] text-white";
    let statusText = "Completed";
    
    if (tx.status && tx.status.toLowerCase() === 'pending') {
      statusClass = "bg-gray-200 text-gray-600";
      statusText = "Pending";
    } else if (tx.status && tx.status.toLowerCase() === 'canceled') {
      statusClass = "bg-[#FA4D4D] text-white";
      statusText = "Canceled";
    }

    const rowHTML = `
      <div class=" searchable-tx grid grid-cols-12 items-center border-b border-gray-100 pb-4 hover:bg-gray-50 transition-colors px-2 rounded-lg">
        <div class="col-span-1 flex justify-center">
          <div class="w-8 h-8 rounded-full ${iconBg} text-white flex items-center justify-center shadow-sm">
            <i data-lucide="${iconName}" class="w-4 h-4"></i>
          </div>
        </div>
        <div class="col-span-3">
          <p class="text-sm text-gray-800 font-bold">${accountNameDisplay}</p>
        </div>
        <div class="col-span-2">
          <p class="text-sm text-gray-500">${tx.method || (isCredit ? 'Direct Pay' : 'Bank Transfer')}</p>
        </div>
        <div class="col-span-2">
          <p class="text-xs text-gray-400">${tx.date}</p>
        </div>
        <div class="col-span-2 text-right pr-4">
          <p class="${amountColor} font-bold text-sm">${amountPrefix}${tx.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
        </div>
        <div class="col-span-2 flex justify-end">
          <span class="w-28 py-1.5 rounded-md text-center text-xs font-semibold ${statusClass}">${statusText}</span>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', rowHTML);
  });
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// 6. Initialize Page
window.addEventListener('DOMContentLoaded', () => {
  renderAccountSummaries();
  renderFullTransactions();
});
// Function to load user details from your register.js data
function loadUserProfile() {
  // Use the exact key from your register.js
  const storedUser = JSON.parse(localStorage.getItem('reenUser'));
  const isLoggedIn = localStorage.getItem('reenLoggedIn');

  // Optional security check: if not logged in, send them back to login
  if (!isLoggedIn || !storedUser) {
    window.location.href = "login.html"; 
    return;
  }
  
  // If logged in, update the HTML
  if (storedUser) {
    const nameEl = document.getElementById('display-user-name');
    const accEl = document.getElementById('display-user-account');
    
    // Update the text on the screen
    if (nameEl) nameEl.textContent = storedUser.name;
    if (accEl) accEl.textContent = storedUser.accountNumber;
  }
}
window.addEventListener('DOMContentLoaded', () => {
  loadUserProfile(); // <--- This pulls the name and account number!
  renderAccounts();
  renderTransactions();
});