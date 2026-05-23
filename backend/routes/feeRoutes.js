const express = require('express');
const { getFees, getFeeById, createFee, updateFee, deleteFee } = require('../controllers/feeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getFees)
    .post(protect, adminOnly, createFee);

router.route('/:id')
    .get(protect, getFeeById)
    .put(protect, adminOnly, updateFee)
    .delete(protect, adminOnly, deleteFee);

module.exports = router;
