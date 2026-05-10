const db = require('./config/db');

async function updateLegacyFees() {
    try {
        console.log("Updating legacy 1500 fees...");
        
        // Let's get all fees to update them correctly
        const [fees] = await db.query('SELECT f.FeeID, s.Year FROM Fees f JOIN Students s ON f.StudentID = s.StudentID');
        
        let updateCount = 0;
        for (const fee of fees) {
            const newAmount = fee.Year == 1 ? 185000 : 180000;
            await db.query('UPDATE Fees SET Amount = ? WHERE FeeID = ?', [newAmount, fee.FeeID]);
            updateCount++;
        }
        
        console.log(`Successfully updated ${updateCount} fee records to the new pricing model!`);
    } catch (e) {
        console.error("Failed to update fees:", e);
    }
    process.exit(0);
}

updateLegacyFees();
