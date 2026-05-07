const express = require('express');
const { getFees, getFeeById, createFee, updateFee, deleteFee } = require('../controllers/feeController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getFees)
    .post(protect, createFee);

router.route('/:id')
    .get(protect, getFeeById)
    .put(protect, updateFee)
    .delete(protect, deleteFee);

module.exports = router;
