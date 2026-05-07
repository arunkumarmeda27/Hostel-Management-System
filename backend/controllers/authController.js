const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM Admins WHERE Username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const admin = rows[0];
        const isMatch = await bcrypt.compare(password, admin.PasswordHash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin.AdminID, username: admin.Username },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            message: 'Login successful',
            token,
            admin: {
                id: admin.AdminID,
                username: admin.Username
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { loginAdmin };
