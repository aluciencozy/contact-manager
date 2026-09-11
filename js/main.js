// Initialize the app and sets a view path based on exising route

import {renderLoginHTML, renderRegisterHTML} from './auth.js';
import {renderContactsHTML} from './contacts.js';

function initialize() {

    const currentPath = window.location.pathname;

    let desiredView = 'login'; // default View

    // Based on currentPath find the desiredView
    if (currentPath === '/register') {
        desiredView = 'register';
    }
    else if (currentPath === '/contacts') {
        desiredView = 'contacts';
    }

    loadView(desiredView);
}

// Load the View of app based on viewName given
export function loadView(viewName) {
    const rootContainer = document.getElementById('root');
    const isLoggedIn = 0; // This is set using the userToken returned from the api

    // Check if user is logged in
    if (!isLoggedIn && viewName === 'contacts') {
        viewName = 'login'; // redirect to login if user is not logged in
    }

    if (isLoggedIn && (viewName === 'login' || viewName === 'register')) {
        viewName = 'contacts'; // redirect to contacts if user is logged in
    }

    // Update the browser history to reflect the current view without refreshing
    const targetPath = '/' + viewName;
    if(window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
    }

    // Inject the innerHTML of the rootContainer based on viewName
    if (viewName === 'login') {
        rootContainer.innerHTML = renderLoginHTML();

        // Event Listeners needs to setup here as innerHTML overwrites and removes any existing event listeners 
        // Add event listener for login form submission in auth.js
    }
    else if (viewName === 'register') {
        rootContainer.innerHTML = renderRegisterHTML();

        // Event Listeners needs to setup here as innerHTML overwrites and removes any existing event listeners 
        // Add event listener for register form submission in auth.js
    }
    else if (viewName === 'contacts') {
        rootContainer.innerHTML = renderContactsHTML();

        // Event Listeners needs to setup here as innerHTML overwrites and removes any existing event listeners 
        // Add event listener for contacts in contacts.js
    }



}

// Triggers this function when page starts up
initialize();