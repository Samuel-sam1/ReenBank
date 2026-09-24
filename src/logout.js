const logoutButton = document.getElementById("logout-btn");
const logoutModal = document.getElementById("logout-modal");
const cancelLogout = document.getElementById("cancel-logout");
const confirmLogout = document.getElementById("confirm-logout");


/* =========================
   OPEN LOGOUT MODAL
========================= */

if (logoutButton) {

  logoutButton.addEventListener("click", function (event) {

    event.preventDefault();

    logoutModal.classList.remove("hidden");

  });

}


/* =========================
   CANCEL LOGOUT
========================= */

if (cancelLogout) {

  cancelLogout.addEventListener("click", function () {

    logoutModal.classList.add("hidden");

  });

}


/* =========================
   CONFIRM LOGOUT
========================= */

if (confirmLogout) {

  confirmLogout.addEventListener("click", function () {

    // Remove login status
    localStorage.removeItem("reenLoggedIn");

    // Send user to login page
    window.location.replace("login.html");

  });

}


/* =========================
   LUCIDE ICONS
========================= */

lucide.createIcons();