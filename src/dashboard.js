// ========================================
// REEN BANK - DASHBOARD.JS
// ========================================


// ========================================
// USER DATA
// ========================================

const USER_KEY = "reenUser";

const user =
  JSON.parse(localStorage.getItem(USER_KEY));


// ========================================
// DISPLAY USER INFORMATION
// ========================================

const userName =
  document.getElementById("dashboard-user-name");

const accountNumber =
  document.getElementById("dashboard-account-number");


if (user) {

  if (userName) {
    userName.textContent = user.name;
  }

  if (accountNumber) {
    accountNumber.textContent =
      user.accountNumber;
  }

}


// ========================================
// GET DATA FROM LOCAL STORAGE
// ========================================

const accounts = getAccounts();

const transactions = getTransactions();


// ========================================
// CALCULATE CURRENT ACCOUNT DATA
// ========================================

// Main account
const mainAccount = accounts.find(
  account => account.type === "main"
);


// Total balance
const totalBalance = accounts.reduce(
  (total, account) => {
    return total + Number(account.balance);
  },
  0
);


// ========================================
// CALCULATE INCOME
// ========================================

const totalIncome = transactions
  .filter(transaction => transaction.amount > 0)
  .reduce(
    (total, transaction) => {
      return total + Number(transaction.amount);
    },
    0
  );


// ========================================
// CALCULATE EXPENSE
// ========================================

const totalExpense = transactions
  .filter(transaction => transaction.amount < 0)
  .reduce(
    (total, transaction) => {
      return total + Math.abs(
        Number(transaction.amount)
      );
    },
    0
  );


// ========================================
// CURRENT ACCOUNT DATA
// ========================================

const currentAccount = [
  {
    type: "Current Balance",
    amount: totalBalance
  },
  {
    type: "Income",
    amount: totalIncome
  },
  {
    type: "Expense",
    amount: totalExpense
  }
];


// ========================================
// FORMAT MONEY
// ========================================

function formatMoney(amount) {

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2
  }).format(amount);

}


// ========================================
// GET BALANCE DATA
// ========================================

const balance =
  currentAccount.find(
    item => item.type === "Current Balance"
  );

const income =
  currentAccount.find(
    item => item.type === "Income"
  );

const expense =
  currentAccount.find(
    item => item.type === "Expense"
  );


// ========================================
// OVERVIEW BALANCE ELEMENTS
// ========================================

const balanceAmount =
  document.getElementById("balance-amount");

const incomeAmount =
  document.getElementById("income-amount");

const expenseAmount =
  document.getElementById("expense-amount");


// ========================================
// DISPLAY BALANCE
// ========================================

if (balanceAmount && balance) {

  balanceAmount.textContent =
    formatMoney(balance.amount);

}

if (incomeAmount && income) {

  incomeAmount.textContent =
    formatMoney(income.amount);

}

if (expenseAmount && expense) {

  expenseAmount.textContent =
    formatMoney(expense.amount);

}


// ========================================
// SHOW / HIDE BALANCE
// ========================================

const toggleBalance =
  document.getElementById("toggle-balance");

const balanceEye =
  document.getElementById("balance-eye");

let balanceVisible = true;


if (toggleBalance) {

  toggleBalance.addEventListener(
    "click",
    function () {

      balanceVisible =
        !balanceVisible;


      // ==============================
      // SHOW
      // ==============================

      if (balanceVisible) {

        if (balanceAmount && balance) {

          balanceAmount.textContent =
            formatMoney(balance.amount);

        }

        if (incomeAmount && income) {

          incomeAmount.textContent =
            formatMoney(income.amount);

        }

        if (expenseAmount && expense) {

          expenseAmount.textContent =
            formatMoney(expense.amount);

        }

        if (balanceEye) {

          balanceEye.setAttribute(
            "data-lucide",
            "eye-off"
          );

        }

      }


      // ==============================
      // HIDE
      // ==============================

      else {

        if (balanceAmount) {

          balanceAmount.textContent =
            "••••••";

        }

        if (incomeAmount) {

          incomeAmount.textContent =
            "••••••";

        }

        if (expenseAmount) {

          expenseAmount.textContent =
            "••••••";

        }

        if (balanceEye) {

          balanceEye.setAttribute(
            "data-lucide",
            "eye"
          );

        }

      }

      lucide.createIcons();

    }
  );

}


// ========================================
// RENDER ACCOUNTS
// ========================================

const accountsContainer =
  document.getElementById(
    "accounts-container"
  );


if (accountsContainer) {

  accountsContainer.innerHTML = "";


  accounts.forEach(function (account) {

    const accountHTML = `

      <div
        class="bg-reen-light rounded-2xl p-5 shadow-sm"
      >

        <div
          class="flex items-center justify-between mb-2"
        >

          <p
            class="text-reen-purple text-xs font-medium"
          >
            ${account.name}
          </p>


          <button
            type="button"
            class="account-eye text-gray-500 hover:text-reen-dark transition"
            data-id="${account.id}"
          >

            <i
              data-lucide="eye-off"
              class="w-4 h-4"
            ></i>

          </button>

        </div>


        <p
          id="account-balance-${account.id}"
          class="text-lg md:text-xl font-bold text-gray-900"
        >
          ${formatMoney(account.balance)}
        </p>

      </div>

    `;


    accountsContainer.insertAdjacentHTML(
      "beforeend",
      accountHTML
    );

  });


  lucide.createIcons();

}


// ========================================
// ACCOUNT BALANCE SHOW / HIDE
// ========================================

const accountVisibility = {};


accounts.forEach(function (account) {

  accountVisibility[account.id] = true;

});


const accountEyeButtons =
  document.querySelectorAll(".account-eye");


accountEyeButtons.forEach(
  function (eyeButton) {

    eyeButton.addEventListener(
      "click",
      function () {

        const accountId =
          Number(eyeButton.dataset.id);


        const account =
          accounts.find(
            account => account.id === accountId
          );


        const balanceElement =
          document.getElementById(
            `account-balance-${accountId}`
          );


        if (!account || !balanceElement) {
          return;
        }


        accountVisibility[accountId] =
          !accountVisibility[accountId];


        // ==============================
        // SHOW ACCOUNT BALANCE
        // ==============================

        if (accountVisibility[accountId]) {

          balanceElement.textContent =
            formatMoney(account.balance);


          eyeButton.innerHTML = `

            <i
              data-lucide="eye-off"
              class="w-4 h-4"
            ></i>

          `;

        }


        // ==============================
        // HIDE ACCOUNT BALANCE
        // ==============================

        else {

          balanceElement.textContent =
            "••••••";


          eyeButton.innerHTML = `

            <i
              data-lucide="eye"
              class="w-4 h-4"
            ></i>

          `;

        }


        lucide.createIcons();

      }
    );

  }
);


// ========================================
// STATISTICS
// ========================================

const statisticsIncome =
  document.getElementById(
    "statistics-income"
  );


const statisticsExpense =
  document.getElementById(
    "statistics-expense"
  );


const incomeBar =
  document.getElementById(
    "income-bar"
  );


const expenseBar =
  document.getElementById(
    "expense-bar"
  );


// Display income

if (statisticsIncome && income) {

  statisticsIncome.textContent =
    formatMoney(income.amount);

}


// Display expense

if (statisticsExpense && expense) {

  statisticsExpense.textContent =
    formatMoney(expense.amount);

}


// Income bar

if (incomeBar) {

  incomeBar.style.width = "100%";

}


// Expense bar

if (
  expenseBar &&
  income &&
  income.amount > 0
) {

  const expensePercentage =
    (
      expense.amount /
      income.amount
    ) * 100;


  expenseBar.style.width =
    `${expensePercentage}%`;

}


// ========================================
// RENDER TRANSACTIONS
// ========================================

const transactionsContainer =
  document.getElementById(
    "transactions-container"
  );


if (transactionsContainer) {

  transactionsContainer.innerHTML = "";


  transactions.forEach(
    function (transaction) {

      const isIncome =
        transaction.amount > 0;


      const amountClass =
        isIncome
          ? "text-reen-green"
          : "text-red-500";


      const sign =
        isIncome
          ? "+"
          : "-";


      const formattedAmount =
        formatMoney(
          Math.abs(transaction.amount)
        )
          .replace("₦", "")
          .trim();


      const transactionHTML = `

        <div
          class="flex justify-between items-center border-b border-gray-100 pb-3"
        >

          <div class="flex-1">

            <p
              class="text-xs md:text-sm text-gray-500 font-medium"
            >
              ${transaction.name}
            </p>


            <p
              class="text-[10px] md:text-xs text-gray-400 md:hidden"
            >
              ${transaction.date}
              -
              ${transaction.time}
            </p>

          </div>


          <p
            class="text-xs text-gray-400 hidden md:block px-2"
          >
            ${transaction.date}
            -
            ${transaction.time}
          </p>


          <p
            class="${amountClass} font-bold text-xs md:text-sm text-right"
          >
            ${sign} ₦${formattedAmount}
          </p>

        </div>

      `;


      transactionsContainer.insertAdjacentHTML(
        "beforeend",
        transactionHTML
      );

    }
  );

}