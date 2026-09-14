-- Development-only dummy data for the Contact Manager database.
-- The sample account password is: ContactTest123!

USE contact_manager;

INSERT INTO Users (username, email, phone, password_hash)
VALUES (
    'demo_user',
    'demo.user@example.com',
    '4075550100',
    '$2y$12$rZgGTF24UgM2pfnrj1naPOwhyC5ScihAqgBuvkwvpWJXZI7XqQI/6'
)
ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id);

SET @demo_user_id = LAST_INSERT_ID();

INSERT INTO Contacts (user_id, first_name, last_name, email, phone)
SELECT @demo_user_id, 'John', 'Doe', 'john.doe@example.com', '4075550101'
WHERE NOT EXISTS (
    SELECT 1
    FROM Contacts
    WHERE user_id = @demo_user_id
      AND email = 'john.doe@example.com'
);

INSERT INTO Contacts (user_id, first_name, last_name, email, phone)
SELECT @demo_user_id, 'Joanna', 'Smith', 'joanna.smith@example.com', '4075550102'
WHERE NOT EXISTS (
    SELECT 1
    FROM Contacts
    WHERE user_id = @demo_user_id
      AND email = 'joanna.smith@example.com'
);
