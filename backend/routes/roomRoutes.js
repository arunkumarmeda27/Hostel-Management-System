const express = require('express');
const { getRooms, getRoomById, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getRooms)
    .post(protect, adminOnly, createRoom);

router.route('/:id')
    .get(protect, getRoomById)
    .put(protect, adminOnly, updateRoom)
    .delete(protect, adminOnly, deleteRoom);

module.exports = router;
