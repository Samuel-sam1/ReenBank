// ================================
// ACCOUNT BALANCE SHOW / HIDE
// ================================
const accounts = [
  {
    eye: document.getElementById("main-eye"),
    balance: document.getElementById("main-balance"),
    amount: "₦ 44,500.00",
    visible: true
  },
  {
    eye: document.getElementById("school-eye"),
    balance: document.getElementById("school-balance"),
    amount: "₦ 44,500.00",
    visible: true
  },
  {
    eye: document.getElementById("holiday-eye"),
    balance: document.getElementById("holiday-balance"),
    amount: "₦ 44,500.00",
    visible: true
  }
];
accounts.forEach(function (account) {
  account.eye.addEventListener("click", function () {
    // Toggle true / false
    account.visible = !account.visible;
    if (account.visible) {
      // Show balance
      account.balance.textContent = account.amount;
      // Show eye-off icon
      account.eye.innerHTML = `
        <i data-lucide="eye-off" class="w-4 h-4"></i>
      `;
    } else {
      // Hide balance
      account.balance.textContent = "••••••";
      // Show eye icon
      account.eye.innerHTML = `
        <i data-lucide="eye" class="w-4 h-4"></i>
      `;
    }
    // Re-render Lucide icon
    lucide.createIcons();
  });
});