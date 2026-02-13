-- Create Database
CREATE DATABASE IF NOT EXISTS grievance_redressal_system;
USE grievance_redressal_system;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('citizen', 'staff', 'admin') NOT NULL DEFAULT 'citizen',
  phone VARCHAR(20),
  address TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Grievances Table
CREATE TABLE IF NOT EXISTS grievances (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category_id INT NOT NULL,
  priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  status ENUM('open', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'open',
  assigned_to INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_category_id (category_id),
  INDEX idx_assigned_to (assigned_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Resolutions Table
CREATE TABLE IF NOT EXISTS resolutions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  grievance_id INT NOT NULL,
  staff_id INT NOT NULL,
  notes TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE,
  FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_grievance_id (grievance_id),
  INDEX idx_staff_id (staff_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Password Reset Tokens Table (Optional)
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Default Admin User (password: admin123)
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@grievance.com', '$2a$10$x1z/r9rZ7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7.', 'admin');

-- Insert Sample Categories
INSERT INTO categories (name, description) VALUES 
('Water Supply', 'Issues related to water supply and management'),
('Roads & Infrastructure', 'Problems with roads, potholes, and infrastructure'),
('Electricity', 'Power supply and electricity related issues'),
('Sanitation', 'Cleanliness and waste management issues'),
('Public Transport', 'Issues related to public transportation'),
('Healthcare', 'Health and medical facility related issues'),
('Education', 'School and education related issues'),
('Civic Amenities', 'Parks, gardens, and public amenities');

-- Insert Sample Staff Users (password: staff123)
INSERT INTO users (name, email, password, role) VALUES 
('Staff Member 1', 'staff1@grievance.com', '$2a$10$x1z/r9rZ7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7.', 'staff'),
('Staff Member 2', 'staff2@grievance.com', '$2a$10$x1z/r9rZ7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7.', 'staff');

-- Insert Sample Citizens (password: citizen123)
INSERT INTO users (name, email, password, role) VALUES 
('John Citizen', 'john@example.com', '$2a$10$x1z/r9rZ7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7.', 'citizen'),
('Jane Citizen', 'jane@example.com', '$2a$10$x1z/r9rZ7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7.', 'citizen'),
('Bob Smith', 'bob@example.com', '$2a$10$x1z/r9rZ7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7z7.', 'citizen');

-- Insert Sample Grievances
INSERT INTO grievances (user_id, title, description, category_id, priority, status, assigned_to) VALUES 
(4, 'Water Supply Issue', 'Water supply has been disrupted for 3 days', 1, 'high', 'in_progress', 3),
(4, 'Road Damage', 'Major pothole on Main Street causing accidents', 2, 'high', 'open', NULL),
(5, 'Power Outage', 'Frequent power cuts in the area', 3, 'medium', 'resolved', 3),
(6, 'Sanitation Problem', 'Garbage not collected for a week', 4, 'high', 'in_progress', 4),
(5, 'Bus Stop Repair', 'Bus stop shelter is damaged', 5, 'low', 'open', NULL);

-- Insert Sample Resolutions
INSERT INTO resolutions (grievance_id, staff_id, notes) VALUES 
(4, 3, 'Repair team has been assigned. Expected completion in 2 days.'),
(6, 4, 'Sanitation team dispatched to the location. Cleaning in progress.');
