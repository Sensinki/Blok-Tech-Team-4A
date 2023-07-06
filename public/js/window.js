/* eslint-disable indent */
// Add an event listener to the link
document.getElementById("delete-account-link").addEventListener("click", function (event) {
    event.preventDefault();

    // Ask for confirmation with an alert window
    if (confirm("Are you sure you want to delete your account?")) {
        // If the user confirms, navigate to the delete-account page
        window.location.href = "/delete-account";
    }
});
