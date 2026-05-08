const db = require('./config/db');

async function test() {
    try {
        const [rows] = await db.query('SELECT * FROM Rooms');
        console.log("Rooms:", rows);
    } catch (e) {
        console.error("DB Error:", e);
    }
    process.exit(0);
}

test();
