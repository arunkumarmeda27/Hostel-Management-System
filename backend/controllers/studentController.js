const db = require('../config/db');

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
        const [rows] = await db.query('SELECT * FROM Students WHERE StudentID = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Student not found' });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.sqlMessage || 'Server error' });
    }
};

const createStudent = async (req, res) => {
    const { FullName, Department, Year, PhoneNumber, Email, Address, ParentContact, RoomID } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Students (FullName, Department, Year, PhoneNumber, Email, Address, ParentContact, RoomID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [FullName, Department, Year, PhoneNumber, Email, Address, ParentContact, RoomID || null]
        );
        res.status(201).json({ id: result.insertId, message: 'Student created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.sqlMessage || 'Server error' });
    }
};

const updateStudent = async (req, res) => {
    const { FullName, Department, Year, PhoneNumber, Email, Address, ParentContact, RoomID } = req.body;
    try {
        await db.query(
            'UPDATE Students SET FullName=?, Department=?, Year=?, PhoneNumber=?, Email=?, Address=?, ParentContact=?, RoomID=? WHERE StudentID=?',
            [FullName, Department, Year, PhoneNumber, Email, Address, ParentContact, RoomID || null, req.params.id]
        );
        res.json({ message: 'Student updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.sqlMessage || 'Server error' });
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

module.exports = { getStudents, getStudentById, createStudent, updateStudent, deleteStudent };
