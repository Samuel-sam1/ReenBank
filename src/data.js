// ========================================
// REEN BANK - DATA.JS
// Shared application data
// ========================================


// ========================================
// LOCAL STORAGE KEYS
// ========================================

const ACCOUNTS_KEY = "reenAccounts";
const TRANSACTIONS_KEY = "reenTransactions";


// ========================================
// DEFAULT ACCOUNTS
// These are created only the first time
// ========================================

const defaultAccounts = [
  {
    id: 1,
    name: "Main Account",
    balance: 44500,
    type: "main"
  },
  {
    id: 2,
    name: "School Savings",
    balance: 44500,
    type: "savings"
  },
  {
    id: 3,
    name: "Holiday Plan",
    balance: 44500,
    type: "savings"
  }
];


// ========================================
// DEFAULT TRANSACTIONS
// ========================================

const defaultTransactions = [
  {
    id: 1,
    name: "Oluwaben Jamin",
    amount: -10000,
    date: "06.Mar.2023",
    time: "09:39"
  },
  {
    id: 2,
    name: "Oluwaben Jamin",
    amount: 10000,
    date: "06.Mar.2023",
    time: "09:39"
  },
  {
    id: 3,
    name: "School Payment",
    amount: -5000,
    date: "05.Mar.2023",
    time: "14:25"
  },
  {
    id: 4,
    name: "Salary",
    amount: 50000,
    date: "01.Mar.2023",
    time: "08:15"
  },
  {
    id: 5,
    name: "Oluwaben Jamin",
    amount: 10000,
    date: "28.Feb.2023",
    time: "11:42"
  },
  {
    id: 6,
    name: "Electricity Bill",
    amount: -8500,
    date: "25.Feb.2023",
    time: "16:30"
  }
];


// ========================================
// INITIALIZE ACCOUNTS
// Only creates default data if none exists
// ========================================

function initializeAccounts() {

  const savedAccounts =
    localStorage.getItem(ACCOUNTS_KEY);

  if (!savedAccounts) {

    localStorage.setItem(
      ACCOUNTS_KEY,
      JSON.stringify(defaultAccounts)
    );

  }
}


// ========================================
// INITIALIZE TRANSACTIONS
// ========================================

function initializeTransactions() {

  const savedTransactions =
    localStorage.getItem(TRANSACTIONS_KEY);

  if (!savedTransactions) {

    localStorage.setItem(
      TRANSACTIONS_KEY,
      JSON.stringify(defaultTransactions)
    );

  }
}


// ========================================
// GET ALL ACCOUNTS
// ========================================

function getAccounts() {

  const savedAccounts =
    localStorage.getItem(ACCOUNTS_KEY);

  if (!savedAccounts) {
    return [];
  }

  return JSON.parse(savedAccounts);
}


// ========================================
// SAVE ALL ACCOUNTS
// ========================================

function saveAccounts(accounts) {

  localStorage.setItem(
    ACCOUNTS_KEY,
    JSON.stringify(accounts)
  );
}


// ========================================
// GET ONE ACCOUNT
// ========================================

function getAccountById(id) {

  const accounts = getAccounts();

  return accounts.find(
    account => account.id === Number(id)
  );
}


// ========================================
// UPDATE ONE ACCOUNT
// ========================================

function updateAccount(id, updatedData) {

  const accounts = getAccounts();

  const accountIndex = accounts.findIndex(
    account => account.id === Number(id)
  );

  if (accountIndex === -1) {
    return false;
  }

  accounts[accountIndex] = {
    ...accounts[accountIndex],
    ...updatedData
  };

  saveAccounts(accounts);

  return true;
}


// ========================================
// DELETE ONE ACCOUNT
// ========================================

function deleteAccount(id) {

  let accounts = getAccounts();

  accounts = accounts.filter(
    account => account.id !== Number(id)
  );

  saveAccounts(accounts);
}


// ========================================
// ADD NEW ACCOUNT
// ========================================

function addAccount(accountData) {

  const accounts = getAccounts();

  const newAccount = {
    id: Date.now(),
    name: accountData.name,
    balance: Number(accountData.balance) || 0,
    type: accountData.type || "savings"
  };

  accounts.push(newAccount);

  saveAccounts(accounts);

  return newAccount;
}


// ========================================
// GET ALL TRANSACTIONS
// ========================================

function getTransactions() {

  const savedTransactions =
    localStorage.getItem(TRANSACTIONS_KEY);

  if (!savedTransactions) {
    return [];
  }

  return JSON.parse(savedTransactions);
}


// ========================================
// SAVE ALL TRANSACTIONS
// ========================================

function saveTransactions(transactions) {

  localStorage.setItem(
    TRANSACTIONS_KEY,
    JSON.stringify(transactions)
  );
}


// ========================================
// ADD TRANSACTION
// ========================================

function addTransaction(transactionData) {

  const transactions = getTransactions();

  const newTransaction = {
    id: Date.now(),
    name: transactionData.name,
    amount: Number(transactionData.amount),
    date: transactionData.date,
    time: transactionData.time
  };

  transactions.unshift(newTransaction);

  saveTransactions(transactions);

  return newTransaction;
}


// ========================================
// DELETE TRANSACTION
// ========================================

function deleteTransaction(id) {

  let transactions = getTransactions();

  transactions = transactions.filter(
    transaction => transaction.id !== Number(id)
  );

  saveTransactions(transactions);
}


// ========================================
// INITIALIZE APPLICATION DATA
// ========================================

initializeAccounts();
initializeTransactions();