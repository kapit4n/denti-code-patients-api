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

exports.updatePatient = (req, res, next) => {
  Patient.update(req.params.id, req.body, (err, result) => {
    if (err) return next(err)
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Patient not found or no changes made' })
    }
    res.status(200).json({ message: 'Patient updated successfully'})
  })
}

exports.deletePatient = (req, res, next) => {
  Patient.delete(req.params.id, (err, result) => {
    if (err) return next(err)
      if (result.changes === 0) {
        return res.status(404).json({ message: 'Patient not found' })
      }
      res.status(200).json({ message: 'Patient deleted successfully' })
  })
}

