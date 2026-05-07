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
    
    const hash = "$2b$10$ZxPopSOtUd/vrkCC7W6oz.SB.5TMiuSvoJwSB8a9hQrtVtuhzyh9S";
    await c.query('UPDATE Admins SET PasswordHash = ? WHERE Username = ?', [hash, 'admin']);
    console.log('Fixed hash successfully!');
    process.exit(0);
}
fix();
