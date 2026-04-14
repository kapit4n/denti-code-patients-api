const Patient = require('../models/patientModel')

exports.createPatient = (req, res, next) => {
  const emailRaw = req.body.Email
  const email =
    emailRaw && typeof emailRaw === 'string' && emailRaw.trim() ? emailRaw.trim() : null
  const payload = {
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    DateOfBirth: req.body.DateOfBirth,
    Gender: req.body.Gender ?? null,
    Address: req.body.Address ?? null,
    ContactPhone: req.body.ContactPhone,
    Email: email,
    MedicalHistorySummary: req.body.MedicalHistorySummary ?? null,
  }
  Patient.create(payload, (err, result) => {
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

exports.patchProfile = (req, res, next) => {
  const userEmail = req.headers['x-user-email'];

  if (!userEmail) {
    return res.status(401).json({ message: 'Unauthorized: User identity not provided in request.' });
  }

  const allowedKeys = new Set([
    'FirstName',
    'LastName',
    'DateOfBirth',
    'Gender',
    'Address',
    'ContactPhone',
    'MedicalHistorySummary',
    'AvatarUrl',
  ]);

  const input = (req.body && typeof req.body === 'object') ? req.body : {};
  const patch = {};
  for (const [k, v] of Object.entries(input)) {
    if (!allowedKeys.has(k)) continue;
    patch[k] = v;
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'AvatarUrl')) {
    const raw = patch.AvatarUrl;
    if (raw === '' || raw === null) {
      patch.AvatarUrl = null;
    } else if (typeof raw === 'string') {
      const u = raw.trim().slice(0, 2048);
      const ok = /^(\/avatars\/[\w.-]+|https?:\/\/.+)$/.test(u);
      if (!ok) {
        return res.status(400).json({ message: 'Invalid AvatarUrl. Use a path under /avatars/ or an http(s) URL.' });
      }
      patch.AvatarUrl = u;
    } else {
      return res.status(400).json({ message: 'AvatarUrl must be a string or null.' });
    }
  }

  Patient.findByEmail(userEmail, (err, patient) => {
    if (err) return next(err);

    const ensure = (cb) => {
      if (patient) return cb(null, patient);

      // Mirror GET /me behavior: if no patient exists yet, create a placeholder then patch it.
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
        if (createErr) return next(createErr);
        return Patient.findByEmail(userEmail, (findErr, created) => {
          if (findErr) return next(findErr);
          if (!created) return res.status(404).json({ message: 'Patient profile not found for the logged-in user.' });
          return cb(null, created);
        });
      });
    };

    ensure((ensureErr, ensured) => {
      if (ensureErr) return next(ensureErr);

      const merged = {
        ...ensured,
        ...patch,
        // Never allow changing email via PATCH /me.
        Email: ensured.Email,
      };

      Patient.update(ensured.PatientID, merged, (updateErr, result) => {
        if (updateErr) {
          if (updateErr.message?.includes('UNIQUE constraint failed: Patients.ContactPhone')) {
            return res.status(409).json({ message: 'Conflict: Contact phone already exists.'})
          }
          if (updateErr.message?.includes('UNIQUE constraint failed: Patients.Email')) {
            return res.status(409).json({ message: 'Conflict: Email already exists.'})
          }
          return next(updateErr);
        }
        if (!result || result.changes === 0) {
          return res.status(404).json({ message: 'Patient not found or no changes made' });
        }
        return Patient.findByEmail(userEmail, (findErr, updated) => {
          if (findErr) return next(findErr);
          return res.status(200).json(updated ?? merged);
        });
      });
    });
  });
};

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
  const id = Number.parseInt(String(req.params.id), 10)
  if (!Number.isFinite(id) || id < 1) {
    return res.status(400).json({ message: 'Invalid patient id.' })
  }
  Patient.findById(id, (findErr, existing) => {
    if (findErr) return next(findErr)
    if (!existing) {
      return res.status(404).json({ message: 'Patient not found' })
    }
    const merged = { ...existing, ...req.body, PatientID: existing.PatientID }
    Patient.update(id, merged, (err, result) => {
      if (err) return next(err)
      if (result.changes === 0) {
        return res.status(404).json({ message: 'Patient not found or no changes made' })
      }
      res.status(200).json({ message: 'Patient updated successfully'})
    })
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

