const express = require('express');
const { getAnnouncements, createAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getAnnouncements)
    .post(protect, adminOnly, createAnnouncement);

router.route('/:id')
    .delete(protect, adminOnly, deleteAnnouncement);

module.exports = router;
