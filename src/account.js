  //  REEN BANK - account.js
// 1. Default State (Dynamic Array format)
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
  // Safety Check: If the old data structure exists (balances object instead of accounts array), reset it.
  if (!bankState.accounts || !Array.isArray(bankState.accounts)) {
    console.warn("Old data format detected. Resetting to default state.");
    bankState = defaultState;
    localStorage.setItem('reenBankState', JSON.stringify(bankState));
  }
} catch (e) {
  bankState = defaultState;
}

// Temporary variables for modal context
let currentActiveAccount = '';
let currentActionType = ''; 

// Helpers
function formatCurrency(amount) {
  return '₦ ' + amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getCurrentFormattedDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year} - ${hours}:${minutes}`;
}

// 3. Render the Account Cards Dynamically
function renderAccounts() {
  const wrapper = document.getElementById('accounts-wrapper');
  if (!wrapper) return; // Failsafe if HTML is missing the ID

  let html = '';

  // Loop through all accounts in storage
  bankState.accounts.forEach(acc => {
    // Determine visibility state for the balance
    const balanceDisplay = acc.hidden ? '₦ * * * * *' : formatCurrency(acc.balance);
    // If hidden, show the 'eye-off' icon. If visible, show 'eye'
    const eyeIcon = acc.hidden ? 'eye-off' : 'eye';
    
    html += `
      <div class="bg-[#DDF7EE] rounded-2xl p-6 shadow-sm flex flex-col justify-between h-48 border-l-4 ${acc.theme}">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-[#5645A5] text-sm font-medium mb-1">${acc.name}</p>
            <p class="text-2xl font-bold text-gray-900">${balanceDisplay}</p>
          </div>
          <button onclick="toggleVisibility('${acc.id}')" class=" cursor-pointer text-gray-500 hover:text-gray-700">
            <i data-lucide="${eyeIcon}" class="w-4 h-4"></i>
          </button>
        </div>
        <div class="flex gap-3 mt-4">
          <button onclick="openFundModal('${acc.id}', 'fund')" class="cursor-pointer flex-1 bg-[#19B66B] text-white text-sm font-medium py-2 rounded-lg hover:bg-green-600 transition-colors">Fund</button>
          <button onclick="openWithdrawModal('${acc.id}', 'withdraw')" class="cursor-pointer flex-1 bg-gray-200 text-gray-600 text-sm font-medium py-2 rounded-lg hover:bg-gray-300 transition-colors">Withdraw</button>
        </div>
      </div>
    `;
  });

  // Always append the "Add Account" button at the end
  html += `
    <div onclick="openAddAccountModal()" class="bg-[#F8F9FA] rounded-2xl p-6 shadow-sm flex flex-col justify-center h-48 border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
      <div class="flex items-center justify-center gap-2 mb-4 text-gray-600">
        <i data-lucide="plus" class="w-5 h-5"></i>
        <span class="font-medium">Add Account</span>
      </div>
      <p class="text-2xl font-bold text-gray-400 text-center">₦ 0.00</p>
    </div>
  `;

  wrapper.innerHTML = html;
  if (typeof lucide !== 'undefined') {
    lucide.createIcons(); 
  }
}

// 4. Toggle Visibility for a specific card
function toggleVisibility(accountId) {
  const account = bankState.accounts.find(a => a.id === accountId);
  if (account) {
    account.hidden = !account.hidden; // Swap true/false
    localStorage.setItem('reenBankState', JSON.stringify(bankState));
    renderAccounts(); // Re-render the cards with the updated view
  }
}

// 5. Render Transactions History
function renderTransactions() {
  const container = document.getElementById('transactions-container');
  if (!container) return;

  container.innerHTML = ''; 

  if (bankState.transactions.length === 0) {
    container.innerHTML = `
      <div class="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
        <p>No transactions yet. Fund an account to get started.</p>
      </div>
    `;
    return;
  }

  // Reverse array to show newest first
  const reversedTx = [...bankState.transactions].reverse();

  reversedTx.forEach(tx => {
    // Find the account name from the dynamic array
    const matchedAccount = bankState.accounts.find(a => a.id === tx.accountId);
    const accountNameDisplay = matchedAccount ? matchedAccount.name : "Unknown Account";

    const isCredit = tx.type === 'credit';
    const iconBg = isCredit ? 'bg-[#19B66B]' : 'bg-[#FA6E6E]';
    const iconName = isCredit ? 'plus' : 'minus';
    const amountColor = isCredit ? 'text-[#19B66B]' : 'text-[#FA6E6E]';
    const amountPrefix = isCredit ? '+' : '- ';
    
    const rowHTML = `
      <div class="searchable-tx grid grid-cols-12 items-center border-b border-gray-100 pb-4 hover:bg-gray-50 transition-colors rounded-lg px-2">
        <div class="col-span-1 flex justify-center">
          <div class="w-8 h-8 rounded-full ${iconBg} text-white flex items-center justify-center shadow-sm">
            <i data-lucide="${iconName}" class="w-4 h-4"></i>
          </div>
        </div>
        <div class="col-span-3">
          <p class="text-sm text-gray-800 font-bold">${accountNameDisplay}</p>
        </div>
        <div class="col-span-2">
          <p class="text-sm text-gray-500">${tx.method}</p>
        </div>
        <div class="col-span-3">
          <p class="text-xs text-gray-400">${tx.date}</p>
        </div>
        <div class="col-span-2 text-right pr-4">
          <p class="${amountColor} font-bold text-sm">${amountPrefix}${tx.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
        </div>
        <div class="col-span-1 flex justify-end">
          <span class="w-full py-1.5 rounded-md text-center text-[10px] font-bold uppercase tracking-wider bg-[#2EB875] text-white">Done</span>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', rowHTML);
  });
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/* --- ADD ACCOUNT MODAL LOGIC --- */
function openAddAccountModal() {
  document.getElementById('new-account-name').value = '';
  document.getElementById('addAccountModal').classList.remove('hidden');
  setTimeout(() => document.getElementById('new-account-name').focus(), 100);
}

function closeAddAccountModal() {
  document.getElementById('addAccountModal').classList.add('hidden');
}

function submitNewAccount() {
  const nameInput = document.getElementById('new-account-name').value.trim();
  if (!nameInput) {
    alert("Please enter a name for the new account.");
    return;
  }

  // Create new account object
  const newAccount = {
    id: 'acc_' + Date.now(),
    name: nameInput,
    balance: 0, 
    hidden: false,
    theme: 'border-transparent' 
  };

  bankState.accounts.push(newAccount);
  localStorage.setItem('reenBankState', JSON.stringify(bankState));
  
  closeAddAccountModal();
  renderAccounts();
}

// ==========================================
// FUND / WITHDRAW MODALS
// ==========================================

// let currentActiveAccount = '';


// ==========================================
// FUND ACCOUNT
// ==========================================

function openFundModal(accountId) {
  currentActiveAccount = accountId;

  const account = bankState.accounts.find(a => a.id === accountId);

  if (!account) {
    console.error('Account not found');
    return;
  }

  const modal = document.getElementById('fundModal');
  const accountName = document.getElementById('fund-account-name');
  const amountInput = document.getElementById('fund-amount');

  accountName.textContent = `Fund ${account.name}`;

  amountInput.value = '';

  modal.classList.remove('hidden');

  setTimeout(() => {
    amountInput.focus();
  }, 100);
}


function closeFundModal() {
  const modal = document.getElementById('fundModal');

  if (modal) {
    modal.classList.add('hidden');
  }

  currentActiveAccount = '';
}


function processFunding() {
  const amountInput = document.getElementById('fund-amount');
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount greater than zero.');
    return;
  }

  const account = bankState.accounts.find(
    a => a.id === currentActiveAccount
  );

  if (!account) {
    alert('Account not found.');
    return;
  }

  // Add money
  account.balance += amount;


  // Create transaction
const newTx = {
    id: Date.now(),
    accountId: account.id, 
    type: 'credit', // or currentActionType === 'fund' ? 'credit' : 'debit'
    amount: amount,
    date: getCurrentFormattedDate(), // or your date variable
    
    // 👇 THIS IS THE NEW LINE 👇
    method: document.querySelector('input[name="fund-payment-method"]:checked')?.value || 'Direct Pay',
    
    status: 'Completed'
  };

  bankState.transactions.push(newTx);


  // Notification
  bankState.unreadNotis = (bankState.unreadNotis || 0) + 1;


  // Save
  localStorage.setItem(
    'reenBankState',
    JSON.stringify(bankState)
  );


  closeFundModal();

  // Refresh account/transaction UI if functions exist
  if (typeof renderAccounts === 'function') {
    renderAccounts();
  }

  if (typeof renderTransactions === 'function') {
    renderTransactions();
  }

  // Refresh dashboard
  window.location.reload();
}



// ==========================================
// WITHDRAW FROM ACCOUNT
// ==========================================

function openWithdrawModal(accountId) {
  currentActiveAccount = accountId;

  const account = bankState.accounts.find(a => a.id === accountId);

  if (!account) {
    console.error('Account not found');
    return;
  }

  const modal = document.getElementById('withdrawModal');
  const accountName = document.getElementById('withdraw-account-name');
  const balanceText = document.getElementById('withdraw-current-balance');
  const amountInput = document.getElementById('withdraw-amount');

  accountName.textContent = `Withdraw from ${account.name}`;

  balanceText.textContent =
    `Available balance: ${formatCurrency(account.balance)}`;

  amountInput.value = '';

  modal.classList.remove('hidden');

  setTimeout(() => {
    amountInput.focus();
  }, 100);
}


function closeWithdrawModal() {
  const modal = document.getElementById('withdrawModal');

  if (modal) {
    modal.classList.add('hidden');
  }

  currentActiveAccount = '';
}


function processWithdrawal() {
  const amountInput = document.getElementById('withdraw-amount');
  const amount = parseFloat(amountInput.value);

  // Grab the new recipient details from the UI
  const bank = document.getElementById('withdraw-bank')?.value;
  const accNum = document.getElementById('withdraw-account-num')?.value;
  const accName = document.getElementById('withdraw-account-name')?.value;

  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount greater than zero.');
    return;
  }

  // Ensure recipient details are filled
  if (!bank || !accNum || !accName) {
    alert('Please fill in all recipient details.');
    return;
  }

  const account = bankState.accounts.find(
    a => a.id === currentActiveAccount
  );

  if (!account) {
    alert('Account not found.');
    return;
  }

  // Check balance
  if (amount > account.balance) {
    alert(
      `Insufficient funds in ${account.name}. Your balance is ${formatCurrency(account.balance)}`
    );
    return;
  }

  // Remove money
  account.balance -= amount;

  // Create transaction
  const newTx = {
    id: Date.now(),
    accountId: account.id,
    type: 'debit',
    amount: amount,
    date: getCurrentFormattedDate(),
    method: 'Bank Transfer', // Changed from 'Self Withdrawal' to match the new UI
    status: 'Completed'
  };

  bankState.transactions.push(newTx);

  // Notification
  bankState.unreadNotis = (bankState.unreadNotis || 0) + 1;

  // Save
  localStorage.setItem(
    'reenBankState',
    JSON.stringify(bankState)
  );

  // Close the original withdraw modal
  closeWithdrawModal();

  // Refresh UI
  if (typeof renderAccounts === 'function') {
    renderAccounts();
  }
  if (typeof renderTransactions === 'function') {
    renderTransactions();
  }

  // ==========================================
  // INJECT AMOUNT AND SHOW SUCCESS MODAL
  // ==========================================
  const successModal = document.getElementById('successWithdrawModal');
  const amountSpan = document.getElementById('withdraw-success-amount');
  
  if (successModal && amountSpan) {
    // Format the number and inject it into the span
    amountSpan.textContent = '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 2 });
    
    // Show the modal
    successModal.classList.remove('hidden');
    successModal.classList.add('flex'); // Ensures it centers perfectly
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}

// ==========================================
// GO BACK BUTTON FUNCTION
// ==========================================
function closeWithdrawSuccessModal() {
  const modal = document.getElementById('successWithdrawModal');
  if (modal) {
    modal.classList.add('hidden');
  }
  
  // Refresh dashboard ONLY after they click Go Back
  window.location.reload();
}




// 6. Initialize UI when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  renderAccounts();
  renderTransactions();
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