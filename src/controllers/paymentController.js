const Payment = require('../models/paymentModel');

function parsePatientId(raw) {
  const id = Number.parseInt(String(raw ?? ''), 10);
  if (!Number.isFinite(id) || id < 1) return null;
  return id;
}

exports.getPayments = (req, res, next) => {
  const patientId = parsePatientId(req.query.patientId);
  if (!patientId) {
    return res.status(400).json({ message: 'patientId query param is required.' });
  }

  Payment.findByPatientId(patientId, (err, rows) => {
    if (err) return next(err);
    return res.status(200).json(rows || []);
  });
};

exports.createPayment = (req, res, next) => {
  const patientId = parsePatientId(req.body?.PatientID);
  if (!patientId) {
    return res.status(400).json({ message: 'PatientID is required.' });
  }

  const amount = Number.parseFloat(String(req.body?.Amount ?? ''));
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Amount must be a positive number.' });
  }

  const methodRaw = req.body?.Method;
  const method = typeof methodRaw === 'string' && methodRaw.trim() ? methodRaw.trim().slice(0, 40) : null;

  const noteRaw = req.body?.Note;
  const note = typeof noteRaw === 'string' && noteRaw.trim() ? noteRaw.trim().slice(0, 500) : null;

  const paidAtRaw = req.body?.PaidAt;
  const paidAt = typeof paidAtRaw === 'string' && paidAtRaw.trim() ? paidAtRaw.trim().slice(0, 40) : null;

  const apptRaw = req.body?.AppointmentID;
  const appointmentId =
    apptRaw === null || apptRaw === undefined || apptRaw === ''
      ? null
      : Number.isFinite(Number.parseInt(String(apptRaw), 10))
        ? Number.parseInt(String(apptRaw), 10)
        : null;

  const payload = {
    PatientID: patientId,
    Amount: amount,
    Method: method,
    Note: note,
    PaidAt: paidAt,
    AppointmentID: appointmentId,
  };

  Payment.create(payload, (err, result) => {
    if (err) return next(err);
    Payment.findByPatientId(patientId, (findErr, rows) => {
      if (findErr) return next(findErr);
      const created = (rows || []).find((p) => p.PaymentID === result.id);
      return res.status(201).json(created || { PaymentID: result.id, ...payload });
    });
  });
};

