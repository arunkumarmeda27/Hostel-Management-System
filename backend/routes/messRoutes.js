const express = require('express');
const { getMessPlans, getMessPlanById, createMessPlan, updateMessPlan, deleteMessPlan } = require('../controllers/messController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getMessPlans)
    .post(protect, createMessPlan);

router.route('/:id')
    .get(protect, getMessPlanById)
    .put(protect, updateMessPlan)
    .delete(protect, deleteMessPlan);

module.exports = router;
