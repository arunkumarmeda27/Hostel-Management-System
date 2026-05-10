const db = require('./config/db');

async function updateSchema() {
    try {
        console.log("Removing 'Special' from MessPlans ENUM...");
        
        // Remove any records that might violate the new enum
        await db.query(`DELETE FROM MessPlans WHERE PlanType = 'Special'`);
        
        // Alter the table definition
        await db.query(`ALTER TABLE MessPlans MODIFY COLUMN PlanType ENUM('Veg', 'Non-Veg') NOT NULL;`);
        
        console.log("Successfully updated database schema!");
    } catch (e) {
        console.error("Failed to update schema:", e);
    }
    process.exit(0);
}

updateSchema();
