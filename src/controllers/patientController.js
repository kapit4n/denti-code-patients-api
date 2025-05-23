const Patient = require('../models/patientModel')

exports.createPatient = (req, res, next) => {
  Patient.create(req.body, (err, result) => {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed: Patients.ContactPhone')) {
        return res.status(409).json({ message: 'Conflict: Contact phone already exists.'})
      }
      if (err.message.includes('UNIQUE constraint failed: Patients.Email')) {
        return res.status(409).json({ message: 'Conflict: Email already exists.'})
      }
      return next(err)
    }
    res.status(201).json({ message: 'Patient created successfully', patientId: result.id })
  })
}

exports.getAllPatients = (req, res, next) => {
  Patient.findAll((err, patients) => {
    if (err) return next(err)
      res.status(200).json(patients)
  })
}

exports.getPatientById = (req, res, next) => {
  Patient.findById(req.params.id, (err, patient) => {
    if (err) return next(err)

      if (!patient) {
        return res.status(404).json({ message: 'Patient not found'})
      }

      res.status(200).json(patient)
  })
}

