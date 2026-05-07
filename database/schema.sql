-- Hostel Management System Database Schema

CREATE DATABASE IF NOT EXISTS hostel_management;
USE hostel_management;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS Admins (
    AdminID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Rooms Table
CREATE TABLE IF NOT EXISTS Rooms (
    RoomID INT AUTO_INCREMENT PRIMARY KEY,
    RoomNumber VARCHAR(20) NOT NULL UNIQUE,
    RoomType ENUM('Single', 'Double', 'Triple', 'Dormitory') NOT NULL,
    Capacity INT NOT NULL,
    OccupiedCount INT DEFAULT 0,
    FloorNumber INT NOT NULL
);

-- 3. Students Table
CREATE TABLE IF NOT EXISTS Students (
    StudentID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Department VARCHAR(100) NOT NULL,
    Year INT NOT NULL,
    PhoneNumber VARCHAR(15) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Address TEXT,
    ParentContact VARCHAR(15) NOT NULL,
    RoomID INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID) ON DELETE SET NULL
);

-- 4. Fees Table
CREATE TABLE IF NOT EXISTS Fees (
    FeeID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    DueDate DATE NOT NULL,
    PaymentStatus ENUM('Pending', 'Paid', 'Overdue') DEFAULT 'Pending',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE
);

-- 5. Complaints Table
CREATE TABLE IF NOT EXISTS Complaints (
    ComplaintID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT NOT NULL,
    ComplaintText TEXT NOT NULL,
    Status ENUM('Pending', 'Resolved', 'In Progress') DEFAULT 'Pending',
    Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE
);

-- 6. MessPlans Table
CREATE TABLE IF NOT EXISTS MessPlans (
    MessID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT NOT NULL,
    PlanType ENUM('Veg', 'Non-Veg', 'Special') NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- TRIGGERS
-- --------------------------------------------------------

-- Trigger to update Room OccupiedCount after a student is assigned a room
DELIMITER //
CREATE TRIGGER AfterStudentInsert
AFTER INSERT ON Students
FOR EACH ROW
BEGIN
    IF NEW.RoomID IS NOT NULL THEN
        UPDATE Rooms 
        SET OccupiedCount = OccupiedCount + 1 
        WHERE RoomID = NEW.RoomID;
    END IF;
END;
//
DELIMITER ;

-- Trigger to update Room OccupiedCount after a student is deleted or room is changed
DELIMITER //
CREATE TRIGGER AfterStudentUpdate
AFTER UPDATE ON Students
FOR EACH ROW
BEGIN
    IF OLD.RoomID IS NOT NULL AND (NEW.RoomID IS NULL OR NEW.RoomID != OLD.RoomID) THEN
        UPDATE Rooms 
        SET OccupiedCount = OccupiedCount - 1 
        WHERE RoomID = OLD.RoomID;
    END IF;
    IF NEW.RoomID IS NOT NULL AND (OLD.RoomID IS NULL OR NEW.RoomID != OLD.RoomID) THEN
        UPDATE Rooms 
        SET OccupiedCount = OccupiedCount + 1 
        WHERE RoomID = NEW.RoomID;
    END IF;
END;
//
DELIMITER ;

-- Trigger to update Room OccupiedCount after a student is deleted
DELIMITER //
CREATE TRIGGER AfterStudentDelete
AFTER DELETE ON Students
FOR EACH ROW
BEGIN
    IF OLD.RoomID IS NOT NULL THEN
        UPDATE Rooms 
        SET OccupiedCount = OccupiedCount - 1 
        WHERE RoomID = OLD.RoomID;
    END IF;
END;
//
DELIMITER ;

-- --------------------------------------------------------
-- VIEWS
-- --------------------------------------------------------

-- View for Fee Reports
CREATE VIEW FeeReportsView AS
SELECT 
    f.FeeID,
    s.StudentID,
    s.FullName,
    s.Department,
    f.Amount,
    f.DueDate,
    f.PaymentStatus
FROM 
    Fees f
JOIN 
    Students s ON f.StudentID = s.StudentID;

-- View for Room Occupancy
CREATE VIEW RoomOccupancyView AS
SELECT 
    RoomID,
    RoomNumber,
    RoomType,
    Capacity,
    OccupiedCount,
    (Capacity - OccupiedCount) AS AvailableSpots,
    CASE 
        WHEN OccupiedCount >= Capacity THEN 'Full'
        WHEN OccupiedCount = 0 THEN 'Empty'
        ELSE 'Partially Occupied'
    END AS OccupancyStatus
FROM 
    Rooms;
