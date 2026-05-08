const db = require('../config/db');

const getMessPlans = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT m.*, s.FullName 
            FROM MessPlans m
            JOIN Students s ON m.StudentID = s.StudentID
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.sqlMessage || 'Server error' });
    }
};

const getMessPlanById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM MessPlans WHERE MessID = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Mess plan not found' });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.sqlMessage || 'Server error' });
    }
};

const createMessPlan = async (req, res) => {
    const { StudentID, PlanType, Amount, StartDate, EndDate } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO MessPlans (StudentID, PlanType, Amount, StartDate, EndDate) VALUES (?, ?, ?, ?, ?)',
            [StudentID, PlanType, Amount, StartDate, EndDate]
        );
        res.status(201).json({ id: result.insertId, message: 'Mess plan created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.sqlMessage || 'Server error' });
    }
};

const updateMessPlan = async (req, res) => {
    const { PlanType, Amount, StartDate, EndDate } = req.body;
    try {
        await db.query(
            'UPDATE MessPlans SET PlanType=?, Amount=?, StartDate=?, EndDate=? WHERE MessID=?',
            [PlanType, Amount, StartDate, EndDate, req.params.id]
        );
        res.json({ message: 'Mess plan updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.sqlMessage || 'Server error' });
    }
};

const deleteMessPlan = async (req, res) => {
    try {
        await db.query('DELETE FROM MessPlans WHERE MessID = ?', [req.params.id]);
        res.json({ message: 'Mess plan deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getMessPlans, getMessPlanById, createMessPlan, updateMessPlan, deleteMessPlan };
