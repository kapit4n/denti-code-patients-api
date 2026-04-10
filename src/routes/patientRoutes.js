const express = require('express')
const router = express.Router()
const patientController = require('../controllers/patientController')
const { postValidator, validate } = require('../middleware/requestValidator')
const { requireRole, requireAnyRole } = require('../middleware/roleValidator')

router.post('/', requireRole('ADMIN'), postValidator, validate, patientController.createPatient)
// Staff-only: used by doctor UI (patient list, create appointment) and admin
router.get('/', requireAnyRole('ADMIN', 'DOCTOR'), patientController.getAllPatients)
router.get('/me', patientController.getProfile)
router.get('/:id', requireAnyRole('ADMIN', 'DOCTOR'), patientController.getPatientById)
router.put('/:id', requireRole('ADMIN'), patientController.updatePatient)
router.delete('/:id', requireRole('ADMIN'), patientController.deletePatient)

module.exports = router
