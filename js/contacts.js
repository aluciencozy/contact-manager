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