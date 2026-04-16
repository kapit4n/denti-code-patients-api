const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { requireAnyRole } = require('../middleware/roleValidator');

router.get('/', requireAnyRole('ADMIN', 'DOCTOR'), paymentController.getPayments);
router.post('/', requireAnyRole('ADMIN', 'DOCTOR'), paymentController.createPayment);

module.exports = router;

