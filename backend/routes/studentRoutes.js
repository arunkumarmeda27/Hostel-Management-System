const express = require('express');
const { getStudents, getStudentById, getRoommates, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, adminOnly, getStudents)
    .post(protect, adminOnly, createStudent);

router.route('/:id')
    .get(protect, getStudentById) // Allowed for self
    .put(protect, adminOnly, updateStudent)
    .delete(protect, adminOnly, deleteStudent);

router.route('/:id/roommates')
    .get(protect, getRoommates); // Allowed for self

module.exports = router;
