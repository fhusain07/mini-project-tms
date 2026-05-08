-- ============================================
-- Smart Queue Management System - DB Setup
-- ============================================
-- Run this script using pgAdmin or psql terminal

-- Step 1: Create the database
CREATE DATABASE queue_management;

-- Step 2: Connect to it (run this in psql terminal)
-- \c queue_management

-- ============================================
-- Run the following AFTER connecting to queue_management
-- ============================================

-- Admins table
CREATE TABLE IF NOT EXISTS "Admins" (
    "Id"       SERIAL PRIMARY KEY,
    "Username" VARCHAR(100) NOT NULL UNIQUE,
    "Password" VARCHAR(100) NOT NULL
);

-- Tokens table
CREATE TABLE IF NOT EXISTS "Tokens" (
    "Id"           SERIAL PRIMARY KEY,
    "TokenNumber"  INT          NOT NULL,
    "CustomerName" VARCHAR(200) NOT NULL,
    "Status"       VARCHAR(50)  NOT NULL DEFAULT 'Waiting',
    "CreatedAt"    TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Default admin user (username: admin, password: admin123)
INSERT INTO "Admins" ("Username", "Password")
VALUES ('admin', 'admin123')
ON CONFLICT ("Username") DO NOTHING;

-- Verify
SELECT * FROM "Admins";
