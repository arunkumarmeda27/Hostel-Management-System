const db = require('./config/db');

async function updateSchema() {
    try {
        console.log("Updating Students table schema...");
        
        // Add Username and PasswordHash columns if they don't exist
        const [columns] = await db.query('SHOW COLUMNS FROM Students');
        const columnNames = columns.map(c => c.Field);
        
        if (!columnNames.includes('Username')) {
            await db.query('ALTER TABLE Students ADD COLUMN Username VARCHAR(50) UNIQUE AFTER Email');
            console.log("Added Username column to Students table.");
        }
        
        if (!columnNames.includes('PasswordHash')) {
            await db.query('ALTER TABLE Students ADD COLUMN PasswordHash VARCHAR(255) AFTER Username');
            console.log("Added PasswordHash column to Students table.");
        }
        
        console.log("Creating Announcements table...");
        await db.query(`
            CREATE TABLE IF NOT EXISTS Announcements (
                AnnouncementID INT AUTO_INCREMENT PRIMARY KEY,
                Title VARCHAR(255) NOT NULL,
                Content TEXT NOT NULL,
                CreatedBy INT,
                CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (CreatedBy) REFERENCES Admins(AdminID) ON DELETE SET NULL
            );
        `);
        console.log("Announcements table created or already exists.");
        
        console.log("Successfully updated database schema!");
    } catch (e) {
        console.error("Failed to update schema:", e);
    }
    process.exit(0);
}

updateSchema();
