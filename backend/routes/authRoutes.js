const express = require('express');
const { loginAdmin, loginStudent } = require('../controllers/authController');
const router = express.Router();

router.post('/login', loginAdmin);
router.post('/student/login', loginStudent);

module.exports = router;
