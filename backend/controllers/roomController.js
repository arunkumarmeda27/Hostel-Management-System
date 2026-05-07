const db = require('../config/db');

const getRooms = async (req, res) => {
    try {
        // Fetching from view if we want to use the RoomOccupancyView
        const [rows] = await db.query('SELECT * FROM RoomOccupancyView');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getRoomById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Rooms WHERE RoomID = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Room not found' });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createRoom = async (req, res) => {
    const { RoomNumber, RoomType, Capacity, FloorNumber } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Rooms (RoomNumber, RoomType, Capacity, FloorNumber) VALUES (?, ?, ?, ?)',
            [RoomNumber, RoomType, Capacity, FloorNumber]
        );
        res.status(201).json({ id: result.insertId, message: 'Room created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateRoom = async (req, res) => {
    const { RoomNumber, RoomType, Capacity, FloorNumber } = req.body;
    try {
        await db.query(
            'UPDATE Rooms SET RoomNumber=?, RoomType=?, Capacity=?, FloorNumber=? WHERE RoomID=?',
            [RoomNumber, RoomType, Capacity, FloorNumber, req.params.id]
        );
        res.json({ message: 'Room updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteRoom = async (req, res) => {
    try {
        await db.query('DELETE FROM Rooms WHERE RoomID = ?', [req.params.id]);
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getRooms, getRoomById, createRoom, updateRoom, deleteRoom };
