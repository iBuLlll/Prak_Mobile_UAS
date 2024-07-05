const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/balance');

router.post('/addBalance', balanceController.addBalance);
router.post('/transferBalance', balanceController.transferBalance);
router.get('/history/:userId', balanceController.getHistory);
router.get('/users/:userId', balanceController.getUserById);

module.exports = router;
