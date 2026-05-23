const db = require('../config/db');

const getAnnouncements = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT a.*, adm.Username as AdminName FROM Announcements a LEFT JOIN Admins adm ON a.CreatedBy = adm.AdminID ORDER BY a.CreatedAt DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.sqlMessage || 'Server error' });
    }
};

const createAnnouncement = async (req, res) => {
    const { Title, Content } = req.body;
    const adminId = req.user.id; // From authMiddleware
    try {
        const [result] = await db.query(
            'INSERT INTO Announcements (Title, Content, CreatedBy) VALUES (?, ?, ?)',
            [Title, Content, adminId]
        );
        res.status(201).json({ id: result.insertId, message: 'Announcement created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.sqlMessage || 'Server error' });
    }
};

const deleteAnnouncement = async (req, res) => {
    try {
        await db.query('DELETE FROM Announcements WHERE AnnouncementID = ?', [req.params.id]);
        res.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.sqlMessage || 'Server error' });
    }
};

module.exports = { getAnnouncements, createAnnouncement, deleteAnnouncement };
