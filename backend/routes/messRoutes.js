const express = require('express');
const { getMessPlans, getMessPlanById, createMessPlan, updateMessPlan, deleteMessPlan } = require('../controllers/messController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getMessPlans)
    .post(protect, adminOnly, createMessPlan);

router.route('/:id')
    .get(protect, getMessPlanById)
    .put(protect, adminOnly, updateMessPlan)
    .delete(protect, adminOnly, deleteMessPlan);

module.exports = router;
