const db = require('../config/database')

const Patient = {
  create: (patientData, callback) => {
    const { FirstName, LastName, DateOfBirth, Gender, Address, ContactPhone, Email, MedicalHistorySummary } = patientData
    const sql = `INSERT INTO Patients (FirstName, LastName, DateOfBirth, Gender, Address, ContactPhone, Email, MedicalHistorySummary)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    db.run(sql, [FirstName, LastName, DateOfBirth, Gender, Address, ContactPhone, Email, MedicalHistorySummary], function(err) {
      callback(err, {id: this ? this.lastID : null})
    })
  },
  findAll: (callback) => {
    const sql = `SELECT * FROM Patients ORDER BY LastName, FirstName`
    db.all(sql, [], callback)
  },
  findById: (id, callback) => {
    const sql = `SELECT * from Patients WHERE PatientID = ?`
    db.get(sql, [id], callback)
  },
  update: (id, patientData, callback) => {
    const { FirstName, LastName, DateOfBirth, Gender, Address, ContactPhone, Email, MedicalHistorySummary, LastVisitDate } = patientData

    const sql = `UPDATE Patients SET
                        FirstName = ?, LastName = ?, DateOfBirth = ?, Gender = ?,
                        Address = ?, ContactPhone = ?, Email = ?, MedicalHistorySummary = ?,
                        LastVisitDate = COALESCE(?, LastVisitDate)
                     WHERE PatientID = ?`;
    
    db.run(sql, [FirstName, LastName, DateOfBirth, Gender, Address, ContactPhone, Email, MedicalHistorySummary, LastVisitDate, id], function (err) {
      callback(err, { changes: this ? this.changes: 0 })
    })
  }
}

module.exports = Patient