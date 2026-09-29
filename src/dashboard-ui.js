/* =========================================
   REEN BANK - dashboard-ui.js
   Handles Global Search & Notifications
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================
     1. REAL-TIME SEARCH FUNCTIONALITY
     ========================================= */
  const searchInput = document.getElementById('global-search');
  
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase();
      // Find all transaction rows on the page that have the 'searchable-tx' class
      const transactions = document.querySelectorAll('.searchable-tx');
      
      transactions.forEach(row => {
        // Read the text content of the row
        const rowText = row.textContent.toLowerCase();
        // If it matches the search term, show it. Otherwise, hide it.
        if (rowText.includes(searchTerm)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }

  /* =========================================
     2. NOTIFICATION SYSTEM
     ========================================= */
  const notiBtn = document.getElementById('noti-btn');
  const notiDropdown = document.getElementById('noti-dropdown');
  const notiBadge = document.getElementById('noti-badge');
  const notiList = document.getElementById('noti-list');
  const clearNotiBtn = document.getElementById('clear-noti');

  // Load state to check for unread notifications
function updateNotificationBadge() {
    let bankState = JSON.parse(localStorage.getItem('reenBankState'));
    if (bankState && bankState.unreadNotis && bankState.unreadNotis > 0) {
      notiBadge.textContent = bankState.unreadNotis; // Insert the number
      notiBadge.classList.remove('hidden'); // Show the badge
    } else {
      notiBadge.classList.add('hidden'); // Hide the badge when 0
    }
  }

  // Populate the dropdown with recent transactions
  function populateNotifications() {
    let bankState = JSON.parse(localStorage.getItem('reenBankState'));
    if (!bankState || !bankState.transactions || bankState.transactions.length === 0) {
      notiList.innerHTML = `<div class="p-6 text-center text-sm text-gray-400">No new notifications</div>`;
      return;
    }

    // Get the latest 5 transactions
    const recentTx = [...bankState.transactions].reverse().slice(0, 5);
    let html = '';

    recentTx.forEach(tx => {
      const isCredit = tx.type === 'credit';
      const colorClass = isCredit ? 'text-[#19B66B]' : 'text-[#FA6E6E]';
      const actionText = isCredit ? 'Deposited' : 'Withdrew';
      const accountObj = bankState.accounts.find(a => a.id === tx.accountId);
      const accName = accountObj ? accountObj.name : "Account";

      html += `
        <div class="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
          <p class="text-sm text-gray-800">
            You <span class="font-bold ${colorClass}">${actionText} ₦${tx.amount.toLocaleString('en-NG')}</span> 
            ${isCredit ? 'into' : 'from'} your ${accName}.
          </p>
          <p class="text-xs text-gray-400 mt-1">${tx.date}</p>
        </div>
      `;
    });

    notiList.innerHTML = html;
  }

  // Toggle Dropdown Menu
  if (notiBtn) {
    notiBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent closing immediately
      notiDropdown.classList.toggle('hidden');
      
      if (!notiDropdown.classList.contains('hidden')) {
        populateNotifications();
      }
    });
  }

  // Mark all as read
  if (clearNotiBtn) {
    clearNotiBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      let bankState = JSON.parse(localStorage.getItem('reenBankState'));
      if (bankState) {
        bankState.unreadNotis = 0;
        localStorage.setItem('reenBankState', JSON.stringify(bankState));
      }
      updateNotificationBadge();
      notiDropdown.classList.add('hidden');
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (notiDropdown && !notiDropdown.classList.contains('hidden') && !notiBtn.contains(e.target)) {
      notiDropdown.classList.add('hidden');
    }
  });

  // Run on page load
  updateNotificationBadge();

});
// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Get Elements
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const closeMenuBtn = document.getElementById("close-menu-btn");
  const mobileSidebar = document.getElementById("mobile-sidebar");
  const mobileOverlay = document.getElementById("mobile-overlay");

  // 2. Open Menu Function
  function openMenu() {
    // Show overlay first
    mobileOverlay.classList.remove("hidden");
    
    // Slight delay so the opacity transition works smoothly
    setTimeout(() => {
      mobileOverlay.classList.remove("opacity-0");
      mobileOverlay.classList.add("opacity-100");
    }, 10);
    
    // Slide in the sidebar
    mobileSidebar.classList.remove("-translate-x-full");
  }

  // 3. Close Menu Function
  function closeMenu() {
    // Slide out the sidebar
    mobileSidebar.classList.add("-translate-x-full");
    
    // Fade out overlay
    mobileOverlay.classList.remove("opacity-100");
    mobileOverlay.classList.add("opacity-0");
    
    // Hide overlay completely after the animation finishes (300ms matches Tailwind duration)
    setTimeout(() => {
      mobileOverlay.classList.add("hidden");
    }, 300); 
  }

  // 4. Attach Event Listeners
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", openMenu);
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener("click", closeMenu);
  }

  // Allow users to close the menu by clicking on the dark background
  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", closeMenu);
  }

});
document.addEventListener("DOMContentLoaded", () => {
  const storedUser = JSON.parse(localStorage.getItem('reenUser'));
  if (storedUser && storedUser.avatar) {
    document.querySelectorAll('.user-avatar-img').forEach(img => {
      img.src = storedUser.avatar;
    });
  }
});