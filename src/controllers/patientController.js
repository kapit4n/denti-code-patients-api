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

exports.getProfile = (req, res, next) => {
  const userEmail = req.headers['x-user-email'];

  if (!userEmail) {
    return res.status(401).json({ message: 'Unauthorized: User identity not provided in request.' });
  }

  Patient.findByEmail(userEmail, (err, patient) => {
    if (err) {
      return next(err);
    }
    if (!patient) {
      const now = Date.now();
      const baseName = String(userEmail).split('@')[0] || 'patient';
      const autoPatient = {
        FirstName: baseName.slice(0, 40),
        LastName: 'User',
        DateOfBirth: '1900-01-01',
        Gender: null,
        Address: null,
        ContactPhone: `auto-${now}`,
        Email: userEmail,
        MedicalHistorySummary: null,
      };

      return Patient.create(autoPatient, (createErr) => {
        if (createErr) {
          return next(createErr);
        }

        return Patient.findByEmail(userEmail, (findErr, createdPatient) => {
          if (findErr) return next(findErr);
          if (!createdPatient) {
            return res.status(404).json({ message: 'Patient profile not found for the logged-in user.' });
          }
          return res.status(200).json(createdPatient);
        });
      });
    }
    return res.status(200).json(patient);
  });
}

exports.getPatientById = (req, res, next) => {
  const id = Number.parseInt(String(req.params.id), 10)
  if (!Number.isFinite(id) || id < 1) {
    return res.status(400).json({ message: 'Invalid patient id.' })
  }

  Patient.findById(id, (err, patient) => {
    if (err) return next(err)

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
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

