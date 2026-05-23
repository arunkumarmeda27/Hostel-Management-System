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
            { id: admin.AdminID, username: admin.Username, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: admin.AdminID,
                username: admin.Username,
                role: 'admin'
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginStudent = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM Students WHERE Username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const student = rows[0];
        const isMatch = await bcrypt.compare(password, student.PasswordHash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: student.StudentID, username: student.Username, role: 'student' },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: student.StudentID,
                username: student.Username,
                role: 'student',
                fullName: student.FullName
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { loginAdmin, loginStudent };
