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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
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

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  const registerResultMessage = document.getElementById(
    "registerResultMessage",
  );

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/api/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, phone, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        window.location.href = "contacts.html";
      } else {
        registerResultMessage.textContent =
          "Registration failed: " + result.message;
        registerResultMessage.style.color = "red";
      }
    } catch (error) {
      console.error("Registration failed:", error);
      registerResultMessage.textContent =
        "Error during registration. Please try again.";
      registerResultMessage.style.color = "red";
    }
  });
}

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/logout.php", {
        method: "POST",
      });

      if (response.ok) {
        window.location.href = "index.html";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  });
}
