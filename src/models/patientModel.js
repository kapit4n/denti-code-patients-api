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
  }
}

module.exports = Patient