const express = require('express')
const router = express.Router()
const patientController = require('../controllers/patientController')
const { postValidator, validate } = require('../middleware/requestValidator')
const { requireRole } = require('../middleware/roleValidator')

router.post('/', requireRole('ADMIN'), postValidator, validate, patientController.createPatient)
router.get('/', patientController.getAllPatients)
router.get('/:id', patientController.getPatientById)
router.put('/:id', requireRole('ADMIN'), patientController.updatePatient)
router.delete('/:id', requireRole('ADMIN'), patientController.deletePatient)

module.exports = router
