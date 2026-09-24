const LOGIN_KEY = "reenLoggedIn";

// If user is not logged in, don't allow them to stay on this page
if (localStorage.getItem(LOGIN_KEY) !== "true") {
  window.location.replace("login.html");
}

// Add a history entry
history.pushState(null, "", location.href);

// If user presses Back
window.addEventListener("popstate", function () {

  // Check login status again
  if (localStorage.getItem(LOGIN_KEY) !== "true") {
    window.location.replace("login.html");
    return;
  }

  // If still logged in, keep them on the current page
  history.pushState(null, "", location.href);
});