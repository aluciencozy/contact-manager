# Database setup

The Contact Manager uses MySQL 8.0 and the `contact_manager` database. The
schema uses InnoDB tables and `utf8mb4` text encoding.

## Tables

- `Users` stores each account's username, email address, phone number, bcrypt
  password hash, and creation time. Username, email, and phone are unique.
- `Contacts` stores a user's contacts and their creation and update times.
  `Contacts.user_id` references `Users.id`. Deleting a user also deletes that
  user's contacts.

The contacts indexes support listing and searching names within one user's
address book.

## Initialize the database

Run these commands from the repository root on a server with MySQL 8.0:

```sh
sudo mysql < sql/schema.sql
sudo mysql < sql/seed.sql
```

`schema.sql` creates the database and tables if they do not already exist.
`seed.sql` is repeatable and adds development-only sample records without
duplicating them.

The sample account is:

- Username: `demo_user`
- Password: `ContactTest123!`

The password is stored in `Users.password_hash` as a bcrypt hash. Never use
the sample password for a real account or database credential.

## Verify the data

```sh
sudo mysql -e "USE contact_manager; SHOW TABLES;"
sudo mysql -e "USE contact_manager; SELECT COUNT(*) AS users FROM Users;"
sudo mysql -e "USE contact_manager; SELECT COUNT(*) AS contacts FROM Contacts;"
sudo mysql -e "USE contact_manager; SELECT first_name, last_name FROM Contacts WHERE first_name LIKE 'Jo%';"
```

After loading the sample data, the expected totals are one user and two
contacts. The name search should return John Doe and Joanna Smith.

## PHP connection

Copy the example configuration for local development:

```sh
cp api/config/database.example.php api/config/database.php
```

Set the real application password in `api/config/database.php`. That file is
ignored by Git and must not be committed. The application account is named
`contact_manager_app`, connects through `localhost`, and only needs `SELECT`,
`INSERT`, `UPDATE`, and `DELETE` privileges on `contact_manager`.

PHP connects with the `mysqli` extension and verifies account passwords with
`password_verify()`. Registration code should create hashes with
`password_hash()` rather than storing plain-text passwords.

## Deployment note

The GitHub Actions workflow updates the web application after changes reach
`main`, but it does not execute SQL files. Apply future schema changes to the
server separately and commit the corresponding SQL so the database remains
reproducible.

Before using real data, remove the development account:

```sql
DELETE FROM Users WHERE username = 'demo_user';
```

The foreign key's cascade rule removes the sample contacts belonging to that
account.
