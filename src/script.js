// MOBILE MENU
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const mobileMenuClose = document.getElementById("mobile-menu-close");
// OPEN MOBILE MENU
mobileMenuButton.addEventListener("click", () => {
mobileMenu.classList.remove("hidden");
mobileMenuButton.setAttribute("aria-expanded", "true");
});
// CLOSE MOBILE MENU
mobileMenuClose.addEventListener("click", () => {
mobileMenu.classList.add("hidden");
mobileMenuButton.setAttribute("aria-expanded", "false");
});
/* =========================================
   1. FAQ DATA ARRAY
   ========================================= */
const faqData = [
  {
    id: 'signup',
    question: 'How do I sign up for an account with <br class="hidden sm:block"> Reen Bank?',
    // Stripped version for the right side so the <br> doesn't break the single-line layout
    shortQuestion: 'How do I sign up for an account with Reen Bank?',
    answer: 'You can sign up for an account with Reen Bank online by visiting our website and filling out the online application form. Once your application is approved, you will receive instructions for setting up your account and accessing our online banking platform.'
  },
  {
    id: 'account-types',
    question: 'What types of accounts does Reen Bank offer?',
    shortQuestion: 'What types of accounts does Reen Bank offer?',
    answer: 'Reen Bank offers a wide variety of accounts designed for your everyday needs, including Checking Accounts, Savings Accounts, School Savings, and specialized Holiday Plans.'
  },
  {
    id: 'fdic',
    question: 'Is Reen Bank FDIC insured?',
    shortQuestion: 'Is Reen Bank FDIC insured?',
    answer: 'Yes, Reen Bank is a fully insured institution. Your deposits are protected up to the maximum legal limit, providing you with peace of mind regarding your financial security.'
  },
  {
    id: 'access',
    question: 'How can I access my Reen Bank account online?',
    shortQuestion: 'How can I access my Reen Bank account online?',
    answer: 'You can easily access your account 24/7 through our secure web dashboard. Simply log in using your registered email and password to view balances, transfer funds, and monitor your transactions.'
  },
  {
    id: 'security',
    question: 'How secure is Reen Bank and what security measures does Reen Bank have in place to protect my financial information?',
    shortQuestion: 'How secure is Reen Bank and what security measures does Reen Bank have in place to protect my financial information?',
    answer: 'We utilize bank-level encryption, continuous fraud monitoring, and secure OTP (One-Time Password) verifications to ensure that your data and money are always protected from unauthorized access.'
  }
];

// Default to the first question
let activeFaqId = 'signup';

/* =========================================
   2. RENDER FUNCTION
   ========================================= */
function renderFaqs() {
  const leftContainer = document.getElementById('faq-left');
  const rightContainer = document.getElementById('faq-right');

  // Separate the active FAQ from the inactive ones
  const activeFaq = faqData.find(faq => faq.id === activeFaqId);
  const inactiveFaqs = faqData.filter(faq => faq.id !== activeFaqId);

  // --- RENDER LEFT SIDE (Active - Green) ---
  leftContainer.innerHTML = `
    <div id="faq-main" class="max-w-lg animate-fade-in">
      <div class="text-left">
        <h3 class="text-lg sm:text-xl font-semibold text-[#1DB779] underline underline-offset-4 leading-7">
          ${activeFaq.question}
        </h3>
      </div>
      <div id="faq-main-content" class="mt-8">
        <p class="text-sm leading-6 text-gray-600 max-w-lg">
          ${activeFaq.answer}
        </p>
      </div>
    </div>
  `;

  // --- RENDER RIGHT SIDE (Inactive - Purple) ---
  let rightHtml = '';
  inactiveFaqs.forEach(faq => {
    rightHtml += `
      <button 
        type="button" 
        onclick="setActiveFaq('${faq.id}')" 
        class="w-full flex items-center justify-between gap-6 text-left group"
      >
        <span class="text-sm sm:text-base font-semibold text-[#45278D] underline underline-offset-2">
          ${faq.shortQuestion}
        </span>
        <i data-lucide="arrow-right" class="w-5 h-5 shrink-0 text-[#45278D] group-hover:translate-x-1 transition-transform"></i>
      </button>
    `;
  });
  
  rightContainer.innerHTML = rightHtml;

  // Re-initialize Lucide Icons for the newly injected HTML
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/* =========================================
   3. CLICK EVENT HANDLER
   ========================================= */
window.setActiveFaq = function(id) {
  activeFaqId = id; // Update the state to the clicked ID
  renderFaqs();     // Rebuild the DOM
};

// Initialize the FAQ section as soon as the page loads
window.addEventListener('DOMContentLoaded', renderFaqs);