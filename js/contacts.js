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
        contactResultMessage.textContent = "failed to make a new contact " + result.message;
        contactResultMessage.style.color = "red"
    }

  dialog.close();
});

// once the new contact is created we will reload all contacts using GET
const getContactInfo = async (search = "") =>{
    var fetchCall = "/api/contacts/get.php";

    if (search != ""){
        fetchCall = fetchCall + "?search=" + search;   // modiefies fetch call to include search if getContactInfo was called with a search
    }

    const response = await fetch(fetchCall,{
        method: "GET", 
    })

    const result = await response.json();

    //calling to display all contacts from the users DB
    displayContacts(result.contacts);

}

// currently example contacts remove once branch is on main  
const contacts = [
  {
    id: 1,
    first_name: "John",
    last_name: "Smith",
    email: "john@email.com",
    phone_number: "407-555-1234"
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Doe",
    email: "jane@email.com",
    phone_number: "321-555-5678"
  }
];

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
        <button class="editContactButton">Edit</button>
        <button class="deleteContactButton">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}


getContactInfo();
 displayContacts(contacts); // remove when on main so the table doesnt reset the call before 

const searchContainer = document.getElementById("search");

searchContainer.addEventListener("input", () => {getContactInfo(searchContainer.value.trim());} )