  //  REEN BANK - overview.js

// 1. Setup Default State structure (Must mirror account.js)
const defaultState = {
  accounts: [
    { id: 'main', name: 'Main Account', balance: 0, hidden: false, theme: 'border-[#5645A5]' },
    { id: 'school', name: 'School Savings', balance: 0, hidden: false, theme: 'border-[#5645A5]' },
    { id: 'holiday', name: 'Holiday Plan', balance: 0, hidden: false, theme: 'border-transparent' }
  ],
  transactions: [],
  globalHidden: false // Specifically for the Overview master balances
};
// 2. Load state from LocalStorage
let bankState;
try {
  bankState = JSON.parse(localStorage.getItem('reenBankState')) || defaultState;
  // Migration check in case missing elements
  if (!bankState.accounts) bankState = defaultState;
  if (bankState.globalHidden === undefined) bankState.globalHidden = false;
} catch (e) {
  bankState = defaultState;
}
// Helper: Format Currency
function formatCurrency(amount) {
  return '₦ ' + amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// 3. Render Master Dashboard Totals (Top Card & Statistics)
function renderDashboardTotals() {
  // Calculate Totals
  const totalBalance = bankState.accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalIncome = bankState.transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalExpense = bankState.transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

  // Handle Global Hidden State
  const isHidden = bankState.globalHidden;
  const displayBalance = isHidden ? '₦ * * * * *' : formatCurrency(totalBalance);
  const displayIncome = isHidden ? '₦ * * * * *' : formatCurrency(totalIncome);
  const displayExpense = isHidden ? '₦ * * * * *' : formatCurrency(totalExpense);
  
  // Update Top Card
  document.getElementById('total-balance').textContent = displayBalance;
  document.getElementById('total-income').textContent = displayIncome;
  document.getElementById('total-expense').textContent = displayExpense;

  // Update Eye Icon
  const eyeIcon = document.getElementById('global-eye-icon');
  if (eyeIcon) {
    eyeIcon.setAttribute('data-lucide', isHidden ? 'eye-off' : 'eye');
    lucide.createIcons({ attrs: { class: ["w-4", "h-4"] }, nameAttr: 'data-lucide' });
  }

  // Update Statistics Section text
  document.getElementById('stat-income-text').textContent = displayIncome;
  document.getElementById('stat-expense-text').textContent = displayExpense;

  // Calculate widths for the progress bars
  const maxStat = Math.max(totalIncome, totalExpense, 1); // Avoid division by zero
  const incomePercent = totalIncome === 0 && totalExpense === 0 ? 0 : (totalIncome / maxStat) * 100;
  const expensePercent = totalIncome === 0 && totalExpense === 0 ? 0 : (totalExpense / maxStat) * 100;

  // Animate widths
  setTimeout(() => {
    document.getElementById('stat-income-bar').style.width = `${incomePercent}%`;
    document.getElementById('stat-expense-bar').style.width = `${expensePercent}%`;
  }, 100);
}

// 4. Toggle Global Visibility
window.toggleGlobalVisibility = function() {
  bankState.globalHidden = !bankState.globalHidden;
  localStorage.setItem('reenBankState', JSON.stringify(bankState));
  renderDashboardTotals();
};

// 5. Render Account Mini-Cards (Middle Section)
function renderAccountsGrid() {
  const wrapper = document.getElementById('overview-accounts-wrapper');
  if (!wrapper) return;

  let html = '';

  bankState.accounts.forEach(acc => {
    // Determine visibility state (syncs with the account page hidden state)
    const balanceDisplay = acc.hidden ? '₦ * * * * *' : formatCurrency(acc.balance);
    
    html += `
      <div class="bg-[#DDF7EE] rounded-2xl p-5 shadow-sm">
        <p class="text-[#5645A5] text-xs font-medium mb-2">${acc.name}</p>
        <p class="text-xl font-bold text-gray-900">${balanceDisplay}</p>
      </div>
    `;
  });

  wrapper.innerHTML = html;
}

// 6. Render Latest Transactions (Right Column)
function renderRecentTransactions() {
  const container = document.getElementById('overview-transactions-list');
  if (!container) return;

  container.innerHTML = ''; 

  if (bankState.transactions.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-gray-400 text-sm">
        No recent transactions.
      </div>
    `;
    return;
  }

  // Get the latest 8 transactions
  const recentTx = [...bankState.transactions].reverse().slice(0, 8);

  recentTx.forEach(tx => {
    // Find account name
    const matchedAccount = bankState.accounts.find(a => a.id === tx.accountId);
    const accName = matchedAccount ? matchedAccount.name : "System";

    const isCredit = tx.type === 'credit';
    const amountColor = isCredit ? 'text-[#19B66B]' : 'text-red-500';
    const amountPrefix = isCredit ? '+' : '- ';
    
    const rowHTML = `
      <div class=" searchable-tx flex justify-between items-center border-b border-gray-100 pb-3 hover:bg-gray-50 px-2 rounded transition-colors">
        <div class="flex-1">
          <p class="text-sm text-gray-600 font-bold">${accName}</p>
        </div>
        <p class="text-xs text-gray-400 w-32 text-center">${tx.date}</p>
        <p class="${amountColor} font-bold text-sm w-28 text-right">${amountPrefix}${tx.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', rowHTML);
  });
}

// 7. Add Account Modal Logic (Reused from account.js)
window.openAddAccountModal = function() {
  document.getElementById('new-account-name').value = '';
  document.getElementById('addAccountModal').classList.remove('hidden');
  setTimeout(() => document.getElementById('new-account-name').focus(), 100);
};

window.closeAddAccountModal = function() {
  document.getElementById('addAccountModal').classList.add('hidden');
};

window.submitNewAccount = function() {
  const nameInput = document.getElementById('new-account-name').value.trim();
  if (!nameInput) {
    alert("Please enter a name for the new account.");
    return;
  }

  const newAccount = {
    id: 'acc_' + Date.now(),
    name: nameInput,
    balance: 0, 
    hidden: false,
    theme: 'border-transparent'
  };

  // Push, Save, Re-render
  bankState.accounts.push(newAccount);
  localStorage.setItem('reenBankState', JSON.stringify(bankState));
  
  closeAddAccountModal();
  renderAccountsGrid();
  renderDashboardTotals(); // Updates total balance UI
};

// 8. Initialize Dashboard
window.addEventListener('DOMContentLoaded', () => {
  renderDashboardTotals();
  renderAccountsGrid();
  renderRecentTransactions();
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
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

/* =========================================================
   ACCOUNT CREATION & SUCCESS MODAL LOGIC (OVERVIEW.JS)
   ========================================================= */

// 1. Handle Account Creation
window.submitNewAccount = function() {
  const nameInput = document.getElementById('new-account-name').value.trim();
  
  if (!nameInput) {
    alert("Please enter a name for the new account.");
    return;
  }

  // Create the new account object
  const newAccountId = 'acc_' + Date.now();
  const newAccount = {
    id: newAccountId,
    name: nameInput,
    balance: 0, 
    hidden: false,
    theme: 'border-[#19B66B]' // Gives new accounts a green border
  };

  // Save to the global bankState (which is loaded by account.js)
  bankState.accounts.push(newAccount);
  localStorage.setItem('reenBankState', JSON.stringify(bankState));
  
  // Close the Add Account Modal and refresh the cards
  document.getElementById('addAccountModal').classList.add('hidden');
  if (typeof renderAccounts === 'function') renderAccounts();

  // Trigger the Success Modal
  showAccountSuccess(nameInput, newAccountId);
};

// 2. Control the Success Modal
window.showAccountSuccess = function(accountName, accountId) {
  const successModal = document.getElementById('successAccountModal');
  const successMsg = document.getElementById('success-account-msg');
  const fundBtn = document.getElementById('success-fund-btn');

  if (successModal && successMsg) {
    // Inject the dynamic success message
    successMsg.innerHTML = `<span class="text-[#19B66B] font-bold">${accountName}</span> has been created successfully.`;
    
    // Program the Fund button
    if (fundBtn) {
      fundBtn.onclick = function() {
        closeSuccessModal(); // Close the success checkmark modal
        
        // Call the Fund modal logic that lives inside account.js!
        if (typeof openTxModal === 'function') {
          openTxModal(accountId, 'fund');
        }
      };
    }
    
    // Show the modal
    successModal.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
};

// 3. Control the "Go Back" Button
window.closeSuccessModal = function() {
  const modal = document.getElementById('successAccountModal');
  if (modal) {
    modal.classList.add('hidden');
  }
};
/* =========================================================
   ACCOUNT CREATION, SUCCESS & FUNDING LOGIC (OVERVIEW.JS)
   ========================================================= */

// 1. Create the Account
window.submitNewAccount = function() {
  const nameInput = document.getElementById('new-account-name').value.trim();
  
  if (!nameInput) {
    alert("Please enter a name for the new account.");
    return;
  }

  // Pull fresh state from local storage directly
  let state = JSON.parse(localStorage.getItem('reenBankState')) || { accounts: [], transactions: [] };

  const newAccountId = 'acc_' + Date.now();
  const newAccount = {
    id: newAccountId,
    name: nameInput,
    balance: 0, 
    hidden: false,
    theme: 'border-[#19B66B]'
  };

  // Save to database
  state.accounts.push(newAccount);
  localStorage.setItem('reenBankState', JSON.stringify(state));
  
  // Close Add Account Modal
  const addModal = document.getElementById('addAccountModal');
  if (addModal) addModal.classList.add('hidden');

  // Show Success Modal
  const successModal = document.getElementById('successAccountModal');
  const successMsg = document.getElementById('success-account-msg');
  const fundBtn = document.getElementById('success-fund-btn');

  if (successModal && successMsg) {
    successMsg.innerHTML = `<span class="text-[#19B66B] font-bold">${nameInput}</span> has been created successfully.`;
    
    // Connect the Fund Button
    if (fundBtn) {
      fundBtn.onclick = function() {
        successModal.classList.add('hidden');
        
        // Memorize which account we are funding
        window.currentActiveAccount = newAccountId;
        
        // Open the Transaction Modal
        const txModal = document.getElementById('transactionModal');
        const txTitle = document.getElementById('modal-title');
        const txInput = document.getElementById('tx-amount');
        
        if (txModal && txTitle && txInput) {
          txInput.value = ''; 
          txTitle.textContent = `Fund ${nameInput}`;
          txModal.classList.remove('hidden');
          setTimeout(() => txInput.focus(), 100);
        }
      };
    }
    successModal.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
};

// 2. Close Success Modal & Refresh
window.closeSuccessModal = function() {
  const modal = document.getElementById('successAccountModal');
  if (modal) modal.classList.add('hidden');
  
  // Reload so the Overview dashboard shows the new account totals
  window.location.reload(); 
};

// 3. Close Transaction Modal & Refresh
window.closeTxModal = function() {
  const modal = document.getElementById('transactionModal');
  if (modal) modal.classList.add('hidden');
  
  window.currentActiveAccount = '';
  window.location.reload(); 
};

// 4. Process the Deposit (100% Independent of account.js)
window.processTransaction = function() {
  const amountInput = document.getElementById('tx-amount');
  const amount = parseFloat(amountInput ? amountInput.value : 0);

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount greater than zero.");
    return;
  }

  // Get database
  let state = JSON.parse(localStorage.getItem('reenBankState'));
  if (!state) return;

  // Find the account we just created
  const account = state.accounts.find(a => a.id === window.currentActiveAccount);
  if (!account) {
    alert("Account not found!");
    return;
  }

  // Add the money
  account.balance += amount;

  // Create Date (e.g. 29.Sep.2026 - 14:30)
  const now = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateStr = `${String(now.getDate()).padStart(2, '0')}.${monthNames[now.getMonth()]}.${now.getFullYear()} - ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // Write Receipt
  state.transactions.push({
    id: Date.now(),
    accountId: account.id,
    type: 'credit',
    amount: amount,
    date: dateStr,
    method: 'Self Deposit',
    status: 'Completed'
  });
  
  // Update Notification Badge
  state.unreadNotis = (state.unreadNotis || 0) + 1;
  
  // Save everything back to Local Storage
  localStorage.setItem('reenBankState', JSON.stringify(state));

  // Hide modal and Refresh Page to update all balances instantly!
  document.getElementById('transactionModal').classList.add('hidden');
  window.location.reload();
};

window.toggleTxCreditCardFields = function() {
  const selectedMethod = document.querySelector('input[name="tx-payment-method"]:checked');
  const ccDetails = document.getElementById('tx-credit-card-details');
  
  if (selectedMethod && selectedMethod.value === 'Credit Card') {
    // Show the card details
    ccDetails.classList.remove('hidden');
    // Re-render Lucide icons just in case
    if (typeof lucide !== 'undefined') lucide.createIcons();
  } else {
    // Hide the card details
    ccDetails.classList.add('hidden');
  }
};