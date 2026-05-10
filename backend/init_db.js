const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function initDB() {
    try {
        console.log("Connecting to MySQL to initialize the database...");
        
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true
        });

        // Create DB and Use it
        await connection.query("CREATE DATABASE IF NOT EXISTS hostel_management;");
        await connection.query("USE hostel_management;");

        // We will execute the schema statements manually since mysql2 doesn't support the DELIMITER keyword
        const tablesAndViews = `
            CREATE TABLE IF NOT EXISTS Admins (
                AdminID INT AUTO_INCREMENT PRIMARY KEY,
                Username VARCHAR(50) NOT NULL UNIQUE,
                PasswordHash VARCHAR(255) NOT NULL,
                CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS Rooms (
                RoomID INT AUTO_INCREMENT PRIMARY KEY,
                RoomNumber VARCHAR(20) NOT NULL UNIQUE,
                RoomType ENUM('Single', 'Double', 'Triple', 'Dormitory') NOT NULL,
                Capacity INT NOT NULL,
                OccupiedCount INT DEFAULT 0,
                FloorNumber INT NOT NULL
            );

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

            CREATE TABLE IF NOT EXISTS Fees (
                FeeID INT AUTO_INCREMENT PRIMARY KEY,
                StudentID INT NOT NULL,
                Amount DECIMAL(10, 2) NOT NULL,
                DueDate DATE NOT NULL,
                PaymentStatus ENUM('Pending', 'Paid', 'Overdue') DEFAULT 'Pending',
                CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS Complaints (
                ComplaintID INT AUTO_INCREMENT PRIMARY KEY,
                StudentID INT NOT NULL,
                ComplaintText TEXT NOT NULL,
                Status ENUM('Pending', 'Resolved', 'In Progress') DEFAULT 'Pending',
                Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS MessPlans (
                MessID INT AUTO_INCREMENT PRIMARY KEY,
                StudentID INT NOT NULL,
                PlanType ENUM('Veg', 'Non-Veg') NOT NULL,
                Amount DECIMAL(10, 2) NOT NULL,
                StartDate DATE NOT NULL,
                EndDate DATE NOT NULL,
                FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE
            );
            
            DROP VIEW IF EXISTS FeeReportsView;
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

            DROP VIEW IF EXISTS RoomOccupancyView;
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
        `;
        
        console.log("Creating tables and views...");
        await connection.query(tablesAndViews);

        console.log("Creating triggers...");
        // Execute triggers individually
        const triggers = [
            `DROP TRIGGER IF EXISTS AfterStudentInsert;`,
            `CREATE TRIGGER AfterStudentInsert
            AFTER INSERT ON Students
            FOR EACH ROW
            BEGIN
                IF NEW.RoomID IS NOT NULL THEN
                    UPDATE Rooms 
                    SET OccupiedCount = OccupiedCount + 1 
                    WHERE RoomID = NEW.RoomID;
                END IF;
            END;`,
            `DROP TRIGGER IF EXISTS AfterStudentUpdate;`,
            `CREATE TRIGGER AfterStudentUpdate
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
            END;`,
            `DROP TRIGGER IF EXISTS AfterStudentDelete;`,
            `CREATE TRIGGER AfterStudentDelete
            AFTER DELETE ON Students
            FOR EACH ROW
            BEGIN
                IF OLD.RoomID IS NOT NULL THEN
                    UPDATE Rooms 
                    SET OccupiedCount = OccupiedCount - 1 
                    WHERE RoomID = OLD.RoomID;
                END IF;
            END;`
        ];

        for (const trig of triggers) {
            await connection.query(trig);
        }

        console.log("Executing seed data...");
        const seedPath = path.join(__dirname, '../database/seed.sql');
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await connection.query(seedSql);

        console.log("✅ Database initialized successfully! You can now start the server.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error initializing database:", error);
        process.exit(1);
    }
}

initDB();
