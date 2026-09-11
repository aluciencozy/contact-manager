// all auth routes logic including login / register / logout logic

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    const loginResultMessage = document.getElementById("loginResultMessage");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {

            const response = await fetch("/api/login.php", {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                
                localStorage.setItem("token", result.token);
                loginResultMessage.textContent = "Login successful!";
                loginResultMessage.style.color = "green";
                window.location.href = "contacts.html";
            } else {
                loginResultMessage.textContent = "Login failed: " + result.message;
                loginResultMessage.style.color = "red";
            }
            
        } catch (error) {
            console.error("Login failed:", error);
            loginResultMessage.textContent = "Error during login. Please try again.";
            loginResultMessage.style.color = "red";
        }
});
}

const registerButton = document.getElementById("registerButton");

if (registerButton) {

    const registerResultMessage = document.getElementById("registerResultMessage");

    registerButton.addEventListener("click", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const password = document.getElementById("password").value;

        try {
            // Communicate with the backend to register the user

            // if registration is successful, redirect to login page

            if (0) { // Replace with actual registration check
            window.location.href = "index.html";
            }

        } catch (error) {
            console.error("Registration failed:", error);
            registerResultMessage.textContent = "Error during registration. Please try again.";
            registerResultMessage.style.color = "red";
        }
    });
}