const db = require('./config/db');

async function test() {
    try {
        const [rows] = await db.query('SELECT s.*, r.RoomNumber FROM Students s LEFT JOIN Rooms r ON s.RoomID = r.RoomID');
        console.log(rows);
    } catch (e) {
        console.error("DB Error:", e);
    }
    process.exit(0);
}

test();
