-- Contact Manager database schema
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS contact_manager
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE contact_manager;

CREATE TABLE IF NOT EXISTS Users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(254) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_username (username),
    UNIQUE KEY uq_users_email (email),
    UNIQUE KEY uq_users_phone (phone)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Contacts (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_contacts_user_last_first (user_id, last_name, first_name),
    KEY idx_contacts_user_first (user_id, first_name),
    CONSTRAINT fk_contacts_user
        FOREIGN KEY (user_id) REFERENCES Users (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT chk_contacts_first_name_not_blank
        CHECK (CHAR_LENGTH(TRIM(first_name)) > 0),
    CONSTRAINT chk_contacts_last_name_not_blank
        CHECK (CHAR_LENGTH(TRIM(last_name)) > 0)
) ENGINE=InnoDB;
