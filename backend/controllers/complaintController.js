const db = require('../config/db');

const getComplaints = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT c.*, s.FullName, r.RoomNumber 
            FROM Complaints c 
            JOIN Students s ON c.StudentID = s.StudentID
            LEFT JOIN Rooms r ON s.RoomID = r.RoomID
            ORDER BY c.Date DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getComplaintById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Complaints WHERE ComplaintID = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Complaint not found' });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createComplaint = async (req, res) => {
    const { StudentID, ComplaintText, Status } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Complaints (StudentID, ComplaintText, Status) VALUES (?, ?, ?)',
            [StudentID, ComplaintText, Status || 'Pending']
        );
        res.status(201).json({ id: result.insertId, message: 'Complaint created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateComplaint = async (req, res) => {
    const { Status } = req.body;
    try {
        await db.query(
            'UPDATE Complaints SET Status=? WHERE ComplaintID=?',
            [Status, req.params.id]
        );
        res.json({ message: 'Complaint updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteComplaint = async (req, res) => {
    try {
        await db.query('DELETE FROM Complaints WHERE ComplaintID = ?', [req.params.id]);
        res.json({ message: 'Complaint deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getComplaints, getComplaintById, createComplaint, updateComplaint, deleteComplaint };
