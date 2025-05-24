const express = require('express')
const router = express.Router()
const patientController = require('../controllers/patientController')
const { postValidator, validate } = require('../middleware/requestValidator')

router.post('/', postValidator, validate, patientController.createPatient)
router.get('/', patientController.getAllPatients)
router.get('/:id', patientController.getPatientById)
router.put('/:id', patientController.updatePatient)
router.delete('/:id', patientController.deletePatient)

module.exports = router
