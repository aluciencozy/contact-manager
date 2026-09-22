const contactsContainer = document.getElementById("contactsContainer");
const addContactButton = document.getElementById("addContactButton");
const addContactDialog = document.getElementById("addContactDialog");
const addCancelButton = document.getElementById("addCancelContactButton");
const addContactForm = document.getElementById("addContactForm");
const editContactDialog = document.getElementById("editContactDialog");
const editCancelButton = document.getElementById("editCancelContactButton");
const editContactForm = document.getElementById("editContactForm");
const deleteContactDialog = document.getElementById("deleteContactDialog");
const deleteButtonYes = document.getElementById("deleteButtonYes");
const deleteButtonNo = document.getElementById("deleteButtonNo");


// Add Contact Logic
addContactButton.addEventListener("click", () => { addContactDialog.showModal(); });

addCancelButton.addEventListener("click", () => {addContactDialog.close();});

const contactResultMessage = document.getElementById("contactResultMessage");

addContactForm.addEventListener("submit", async (event) => {
    //making new contact and POSTing to DB
  event.preventDefault();

  const newContactData = new FormData(addContactForm);
  const firstName = newContactData.get("first_name");
  const lastName = newContactData.get("last_name");
  const email = newContactData.get("email");
  const phoneNumber = newContactData.get("phone_number");

  const response = await fetch("/api/contacts/create.php",{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({first_name: firstName, last_name: lastName,
          email, phone: phoneNumber})
  }
  );

  const result = await response.json();

  if (response.ok && result.success){
      getContactInfo(searchContainer.value.trim());
      addContactDialog.close();
      addContactForm.reset()


      contactResultMessage.textContent = "New contact created!"
      contactResultMessage.style.color = "green"
      setTimeout(() => { contactResultMessage.textContent = ""; }, 4000);
  }
  else{
      contactResultMessage.textContent = "Failed to make a new contact " + result.message;
      contactResultMessage.style.color = "red"
      setTimeout(() => { contactResultMessage.textContent = ""; }, 4000);
  }
    
});


// Edit/Delete Contact Logic

let contacts = []
let editContactID = null;
let deleteContactID = null;

contactsContainer.addEventListener("click", (event) => {

  // Edit Contact
  if (event.target.classList.contains("editContactButton")) {

    const contactID = Number(event.target.dataset.id); // ID given by the ID inserted when adding a contact into the list in displayContacts
    const contact = contacts.find(contact => contact.id == contactID) // Finds contact in contact list using ID

    editContactID = contactID;

    // Load The Contacts Data into the Form
    editContactForm.elements["first_name"].value = contact.first_name;
    editContactForm.elements["last_name"].value = contact.last_name;
    editContactForm.elements["email"].value = contact.email;
    editContactForm.elements["phone_number"].value = contact.phone;

    editContactDialog.showModal();
  }

  // Delete Contact
  if (event.target.classList.contains("deleteContactButton")) {
    deleteContactDialog.showModal();

    deleteContactID = Number(event.target.dataset.id);
  }

});

editCancelButton.addEventListener("click", () => {
  editContactID = null;
  editContactDialog.close();
});

editContactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const editedContactData = new FormData(editContactForm);
  const firstName = editedContactData.get("first_name");
  const lastName = editedContactData.get("last_name");
  const email = editedContactData.get("email");
  const phoneNumber = editedContactData.get("phone_number");

  const response = await fetch("/api/contacts/update.php", {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({id: editContactID, first_name: firstName, last_name: lastName, email, phone: phoneNumber})
  });

  const result = await response.json();

  if (response.ok && result.success) {
    getContactInfo(searchContainer.value.trim()); // Refreshes List with Value in Search Bar

    editContactDialog.close();
    editContactForm.reset();
    editContactID = null;

    contactResultMessage.textContent = "Contact updated successfully!";
    contactResultMessage.style.color = "green";
    setTimeout(() => { contactResultMessage.textContent = ""; }, 4000);
  } 
  else {
    contactResultMessage.textContent = "Failed to update contact: " + result.message;
    contactResultMessage.style.color = "red";
    setTimeout(() => { contactResultMessage.textContent = ""; }, 4000);
  }

});

deleteButtonYes.addEventListener("click", async () => {

  const response = await fetch("/api/contacts/delete.php", {
    method: "DELETE",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({id: deleteContactID})
  });

  const result = await response.json();

  if (response.ok && result.success) {
    getContactInfo(searchContainer.value.trim());
    deleteContactDialog.close();

    deleteContactID = null;

    contactResultMessage.textContent = "Contact Successfully Deleted!";
    contactResultMessage.style.color = "green"
    setTimeout(() => { contactResultMessage.textContent = ""; }, 4000);
  }
  else {
    deleteContactDialog.close();

    deleteContactID = null;

    contactResultMessage.textContent = "Failed to delete contact: " + result.message;
    contactResultMessage.style.color = "red";
    setTimeout(() => { contactResultMessage.textContent = ""; }, 4000);
  }
});

deleteButtonNo.addEventListener("click", () => {
  deleteContactID = null;
  deleteContactDialog.close();
});

// once the new contact is created we will reload all contacts using GET
const getContactInfo = async (search = "") =>{
    var fetchCall = "/api/contacts/get.php";

    if (search != ""){
        fetchCall = fetchCall + "?search=" + encodeURIComponent(search);   // modiefies fetch call to include search if getContactInfo was called with a search
    }

    const response = await fetch(fetchCall,{
        method: "GET", 
    })

    const result = await response.json();

    if (response.ok && result.success) {
      // Saves displayed contacts for future use
      contacts = result.contacts;
      //calling to display all contacts from the users DB
      displayContacts(result.contacts);
    } 
    else {
      console.error("Failed to get any contacts:", result.message);
    }
}

// currently example contacts remove once branch is on main  
// const contacts = [
//   {
//     id: 1,
//     first_name: "John",
//     last_name: "Smith",
//     email: "john@email.com",
//     phone: "407-555-1234"
//   },
//   {
//     id: 2,
//     first_name: "Jane",
//     last_name: "Doe",
//     email: "jane@email.com",
//     phone: "321-555-5678"
//   }
// ];

function displayContacts(contacts) {
  const tableBody = document.getElementById("contactsTableBody");

  tableBody.innerHTML = "";

  contacts.forEach((contact) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${contact.first_name}</td>
      <td>${contact.last_name}</td>
      <td>${contact.email}</td>
      <td>${contact.phone}</td>
      <td class="contact-actions">
        <button class="editContactButton" data-id="${contact.id}">Edit</button>
        <button class="deleteContactButton" data-id="${contact.id}">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

getContactInfo();
// displayContacts(contacts); // remove when on main so the table doesnt reset the call before 

const searchContainer = document.getElementById("search");

searchContainer.addEventListener("input", () => {getContactInfo(searchContainer.value.trim());} )
