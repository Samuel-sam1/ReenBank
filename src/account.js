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
          <button onclick="openTxModal('${acc.id}', 'fund')" class="cursor-pointer flex-1 bg-[#19B66B] text-white text-sm font-medium py-2 rounded-lg hover:bg-green-600 transition-colors">Fund</button>
          <button onclick="openTxModal('${acc.id}', 'withdraw')" class="cursor-pointer flex-1 bg-gray-200 text-gray-600 text-sm font-medium py-2 rounded-lg hover:bg-gray-300 transition-colors">Withdraw</button>
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

/* --- FUND/WITHDRAW MODAL LOGIC --- */
function openTxModal(accountId, action) {
  currentActiveAccount = accountId;
  currentActionType = action;
  
  const account = bankState.accounts.find(a => a.id === accountId);
  if (!account) return;

  const modal = document.getElementById('transactionModal');
  const title = document.getElementById('modal-title');
  const submitBtn = document.getElementById('modal-submit-btn');
  const input = document.getElementById('tx-amount');

  input.value = ''; 
  if (action === 'fund') {
    title.textContent = `Fund ${account.name}`;
    submitBtn.textContent = "Deposit";
    submitBtn.className = "flex-1 bg-[#19B66B] text-white font-bold py-3.5 rounded-xl hover:bg-green-600 transition-colors";
  } else {
    title.textContent = `Withdraw from ${account.name}`;
    submitBtn.textContent = "Withdraw";
    submitBtn.className = "flex-1 bg-[#FA6E6E] text-white font-bold py-3.5 rounded-xl hover:bg-red-600 transition-colors";
  }

  modal.classList.remove('hidden');
  setTimeout(() => input.focus(), 100);
}

function closeTxModal() {
  document.getElementById('transactionModal').classList.add('hidden');
  currentActiveAccount = '';
  currentActionType = '';
}

function processTransaction() {
  const amountInput = document.getElementById('tx-amount').value;
  const amount = parseFloat(amountInput);

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount greater than zero.");
    return;
  }

  const account = bankState.accounts.find(a => a.id === currentActiveAccount);

  if (currentActionType === 'withdraw') {
    if (amount > account.balance) {
      alert(`Insufficient funds in ${account.name}. Your balance is ${formatCurrency(account.balance)}`);
      return;
    }
    account.balance -= amount; // Deduct
  } else if (currentActionType === 'fund') {
    account.balance += amount; // Add
  }

  // Create transaction record
 const newTx = {
    id: Date.now(),
    accountId: account.id,
    type: currentActionType === 'fund' ? 'credit' : 'debit',
    amount: amount,
    date: getCurrentFormattedDate(),
    method: currentActionType === 'fund' ? 'Self Deposit' : 'Self Withdrawal',
    status: 'Completed'
  };

  bankState.transactions.push(newTx);
  
  // ---> ADD THIS LINE TO INCREASE THE NOTIFICATION COUNTER <---
  bankState.unreadNotis = (bankState.unreadNotis || 0) + 1;

  localStorage.setItem('reenBankState', JSON.stringify(bankState));

  closeTxModal();
  renderAccounts();
  renderTransactions();
  
  // Refresh the page so the dashboard-ui.js script picks up the new notification
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