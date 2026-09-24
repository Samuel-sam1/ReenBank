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