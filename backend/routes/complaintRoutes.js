const express = require('express');
const { getComplaints, getComplaintById, createComplaint, updateComplaint, deleteComplaint } = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getComplaints)
    .post(protect, createComplaint);

router.route('/:id')
    .get(protect, getComplaintById)
    .put(protect, updateComplaint)
    .delete(protect, deleteComplaint);

module.exports = router;
