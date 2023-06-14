// Voeg een eventlistener toe aan de link
document
  .getElementById("delete-account-link")
  .addEventListener("click", function (event) {
    event.preventDefault();

    // Vraag om bevestiging met een alertvenster
    if (confirm("Are you sure you want to delete your account?")) {
      // Als de gebruiker bevestigt, navigeer naar de delete-account-pagina
      window.location.href = "/delete-account";
    }
  });
