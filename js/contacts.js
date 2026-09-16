const addButton = document.getElementById("addContactButton");
const dialog = document.getElementById("contactDialog");
const cancelButton = document.getElementById("cancelContactButton");
const contactForm = document.getElementById("contactForm");

addButton.addEventListener("click", () => { dialog.showModal(); });

cancelButton.addEventListener("click", () => { dialog.close(); });

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

    //fill in functionality
  dialog.close();
});

contactForm

// all contact CRUD logic

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
        try {
            // Communicate with the backend to log out the user

            // if logout is successful, redirect to login page

            if (1) { // Replace with actual logout check
                window.location.href = "index.html";
            }

        } catch (error) {
            console.error("Logout failed:", error);
        }
    });
}