const db = require('./config/db');

async function seedRooms() {
    try {
        console.log("Clearing existing rooms...");
        // Delete existing rooms. Because of FOREIGN KEY ON DELETE SET NULL, 
        // students in these rooms will simply be unassigned.
        await db.query('DELETE FROM Rooms');

        console.log("Generating 88 new rooms...");
        const floors = [
            { name: 'Ground Floor', floorNumber: 0, prefix: 'G' },
            { name: '1st Floor', floorNumber: 1, prefix: '1' },
            { name: '2nd Floor', floorNumber: 2, prefix: '2' },
            { name: '3rd Floor', floorNumber: 3, prefix: '3' },
        ];

        let insertCount = 0;

        for (const floor of floors) {
            for (let i = 1; i <= 22; i++) {
                // Format room number, e.g., G01, 101, 112, 222
                const roomNum = i < 10 ? `${floor.prefix}0${i}` : `${floor.prefix}${i}`;
                
                await db.query(
                    `INSERT INTO Rooms (RoomNumber, RoomType, Capacity, FloorNumber) 
                     VALUES (?, 'Dormitory', 4, ?)`,
                    [roomNum, floor.floorNumber]
                );
                insertCount++;
            }
        }

        console.log(`Successfully seeded ${insertCount} rooms!`);
    } catch (e) {
        console.error("Failed to seed rooms:", e);
    }
    process.exit(0);
}

seedRooms();
