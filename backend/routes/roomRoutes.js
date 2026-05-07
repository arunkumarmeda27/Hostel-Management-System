const express = require('express');
const { getRooms, getRoomById, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getRooms)
    .post(protect, createRoom);

router.route('/:id')
    .get(protect, getRoomById)
    .put(protect, updateRoom)
    .delete(protect, deleteRoom);

module.exports = router;
