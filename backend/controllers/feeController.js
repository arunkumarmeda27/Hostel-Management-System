const db = require('../config/db');

const getFees = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM FeeReportsView');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.sqlMessage || 'Server error' });
    }
};

const getFeeById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Fees WHERE FeeID = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Fee not found' });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.sqlMessage || 'Server error' });
    }
};

const createFee = async (req, res) => {
    const { StudentID, Amount, DueDate, PaymentStatus } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Fees (StudentID, Amount, DueDate, PaymentStatus) VALUES (?, ?, ?, ?)',
            [StudentID, Amount, DueDate, PaymentStatus || 'Pending']
        );
        res.status(201).json({ id: result.insertId, message: 'Fee record created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.sqlMessage || 'Server error' });
    }
};

const updateFee = async (req, res) => {
    const { Amount, DueDate, PaymentStatus } = req.body;
    try {
        await db.query(
            'UPDATE Fees SET Amount=?, DueDate=?, PaymentStatus=? WHERE FeeID=?',
            [Amount, DueDate, PaymentStatus, req.params.id]
        );
        res.json({ message: 'Fee record updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.sqlMessage || 'Server error' });
    }
};

const deleteFee = async (req, res) => {
    try {
        await db.query('DELETE FROM Fees WHERE FeeID = ?', [req.params.id]);
        res.json({ message: 'Fee record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.sqlMessage || 'Server error' });
    }
};

module.exports = { getFees, getFeeById, createFee, updateFee, deleteFee };
