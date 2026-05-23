const db = require('../config/db');
const bcrypt = require('bcryptjs');

const getStudents = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT s.*, r.RoomNumber FROM Students s LEFT JOIN Rooms r ON s.RoomID = r.RoomID');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.sqlMessage || 'Server error' });
    }
};

const getStudentById = async (req, res) => {
    try {
        // Allow if admin OR if it's the student themselves
        if (req.user.role !== 'admin' && req.user.id != req.params.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const [rows] = await db.query(
            'SELECT s.*, r.RoomNumber FROM Students s LEFT JOIN Rooms r ON s.RoomID = r.RoomID WHERE s.StudentID = ?',
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'Student not found' });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getRoommates = async (req, res) => {
    try {
        // Only allow if admin or if the user is the student
        if (req.user.role !== 'admin' && req.user.id != req.params.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // First, get the student's room
        const [studentRows] = await db.query('SELECT RoomID FROM Students WHERE StudentID = ?', [req.params.id]);
        if (studentRows.length === 0) return res.status(404).json({ message: 'Student not found' });

        const roomId = studentRows[0].RoomID;
        if (!roomId) return res.json([]); // No room assigned, so no roommates

        const [roommates] = await db.query(
            'SELECT StudentID, FullName, Department, Year, PhoneNumber, Email FROM Students WHERE RoomID = ? AND StudentID != ?',
            [roomId, req.params.id]
        );

        res.json(roommates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createStudent = async (req, res) => {
    const { FullName, Department, Year, PhoneNumber, Email, Address, ParentContact, RoomID, Username, Password } = req.body;
    try {
        let passwordHash = null;
        if (Password) {
            passwordHash = await bcrypt.hash(Password, 10);
        } else {
            // Default password is Email if not provided
            passwordHash = await bcrypt.hash(Email, 10);
        }

        const [result] = await db.query(
            'INSERT INTO Students (FullName, Department, Year, PhoneNumber, Email, Username, PasswordHash, Address, ParentContact, RoomID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [FullName, Department, Year, PhoneNumber, Email, Username || Email, passwordHash, Address, ParentContact, RoomID || null]
        );
        res.status(201).json({ id: result.insertId, message: 'Student created successfully' });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email or Username already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

const updateStudent = async (req, res) => {
    const { FullName, Department, Year, PhoneNumber, Email, Address, ParentContact, RoomID, Username, Password } = req.body;
    try {
        let query = 'UPDATE Students SET FullName=?, Department=?, Year=?, PhoneNumber=?, Email=?, Address=?, ParentContact=?, RoomID=?, Username=?';
        let params = [FullName, Department, Year, PhoneNumber, Email, Address, ParentContact, RoomID || null, Username || Email];

        if (Password) {
            const passwordHash = await bcrypt.hash(Password, 10);
            query += ', PasswordHash=?';
            params.push(passwordHash);
        }

        query += ' WHERE StudentID=?';
        params.push(req.params.id);

        await db.query(query, params);
        res.json({ message: 'Student updated successfully' });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email or Username already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteStudent = async (req, res) => {
    try {
        await db.query('DELETE FROM Students WHERE StudentID = ?', [req.params.id]);
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.sqlMessage || 'Server error' });
    }
};

module.exports = { getStudents, getStudentById, getRoommates, createStudent, updateStudent, deleteStudent };
