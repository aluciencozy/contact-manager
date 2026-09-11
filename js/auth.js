// all auth routes logic including login / register / logout logic

// innerHTML for Login View
export function renderLoginHTML() {
    return `
        <h2>Login</h2>
        <form id="login-form">
            <input type="email" id="email" required />
            <input type="password" id="password" required />
            <button type="submit">Log In</button>
        </form>
    `;
}

// innerHTML for Register View
export function renderRegisterHTML() {
    return `
        <h2>Register</h2>
        <form id="register-form">
            <input type="email" id="email" required />
            <input type="password" id="password" required />
        <button type="submit">Register</button>
        </form>
    `;
}

