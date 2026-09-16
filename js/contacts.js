const addButton = document.getElementById("addContactButton");
const dialog = document.getElementById("contactDialog");
const cancelButton = document.getElementById("cancelContactButton");
const contactForm = document.getElementById("contactForm");
const contactsContainer = document.getElementById("contactsContainer");


addButton.addEventListener("click", () => { dialog.showModal(); });

cancelButton.addEventListener("click", () => { dialog.close(); });

const contactResultMessage = document.getElementById("contactResultMessage");

contactForm.addEventListener("submit", async (event) => {
    //making new contact and POSTing to DB
  event.preventDefault();
    const newContactData = new FormData(contactForm);
    const firstName = newContactData.get("first_name");
    const lastName = newContactData.get("last_name");
    const email = newContactData.get("email");
    const phoneNumber = newContactData.get("phone_number");

    const response = await fetch("/api/contacts/create.php",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({firstName, lastName,
            email,  phoneNumber}),
    }
    );

    const result = await response.json();

    if (response.ok && result.success){
        getContactInfo();
        contactResultMessage.textContent = "New contact created!"
        contactResultMessage.style.color = "green"
    }
    else{
        contactResultMessage.textContent = "failed to make a new contact" + result.message;
        contactResultMessage.style.color = "red"
    }

  dialog.close();
});

// once the new contact is created we will reload all contacts using GET
const getContactInfo = async () =>{

    const response = await fetch("/api/contacts/get.php",{
        method: "GET", 
    })

    const result = await response.json();

    contactsContainer.textContent = "";



}



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