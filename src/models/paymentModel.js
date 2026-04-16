const db = require('../config/database');

const Payment = {
  create: (paymentData, callback) => {
    const { PatientID, Amount, Method, Note, PaidAt, AppointmentID } = paymentData;
    const sql = `INSERT INTO Payments (PatientID, Amount, Method, Note, PaidAt, AppointmentID)
                 VALUES (?, ?, ?, ?, COALESCE(?, datetime('now', 'localtime')), ?)`;
    db.run(
      sql,
      [
        PatientID,
        Amount,
        Method ?? null,
        Note ?? null,
        PaidAt ?? null,
        AppointmentID ?? null,
      ],
      function (err) {
        callback(err, { id: this ? this.lastID : null });
      },
    );
  },

  findByPatientId: (patientId, callback) => {
    const sql = `SELECT * FROM Payments WHERE PatientID = ? ORDER BY datetime(PaidAt) DESC, PaymentID DESC`;
    db.all(sql, [patientId], callback);
  },
};

module.exports = Payment;

