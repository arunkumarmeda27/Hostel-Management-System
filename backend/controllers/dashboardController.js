const db = require('../config/db');

const getDashboardStats = async (req, res) => {
    try {
        const [[{ totalStudents }]] = await db.query('SELECT COUNT(*) as totalStudents FROM Students');
        const [[{ totalRooms }]] = await db.query('SELECT COUNT(*) as totalRooms FROM Rooms');
        const [[{ occupiedRooms }]] = await db.query('SELECT COUNT(*) as occupiedRooms FROM Rooms WHERE OccupiedCount > 0');
        const [[{ pendingComplaints }]] = await db.query("SELECT COUNT(*) as pendingComplaints FROM Complaints WHERE Status = 'Pending'");
        const [[{ pendingFeesCount }]] = await db.query("SELECT COUNT(*) as pendingFeesCount FROM Fees WHERE PaymentStatus != 'Paid'");
        
        // Fee data for chart (monthly)
        const [feeData] = await db.query(`
            SELECT DATE_FORMAT(DueDate, '%Y-%m') as month, SUM(Amount) as total 
            FROM Fees 
            WHERE PaymentStatus = 'Paid' 
            GROUP BY month 
            ORDER BY month ASC 
            LIMIT 6
        `);

        // Occupancy for chart
        const [occupancyData] = await db.query(`
            SELECT RoomType as name, COUNT(*) as value
            FROM Rooms
            WHERE OccupiedCount > 0
            GROUP BY RoomType
        `);

        res.json({
            stats: {
                totalStudents,
                totalRooms,
                occupiedRooms,
                availableRooms: totalRooms - occupiedRooms,
                pendingComplaints,
                pendingFeesCount
            },
            charts: {
                feeData,
                occupancyData
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getDashboardStats };
