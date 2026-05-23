const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function fix() {
    const c = await mysql.createConnection({
        host: process.env.DB_HOST, 
        user: process.env.DB_USER, 
        password: process.env.DB_PASSWORD, 
        database: process.env.DB_NAME
    });
    
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('admin123', 10);
    await c.query('UPDATE Admins SET PasswordHash = ? WHERE Username = ?', [hash, 'admin']);
    console.log('Fixed hash successfully!');
    process.exit(0);
}
fix();
