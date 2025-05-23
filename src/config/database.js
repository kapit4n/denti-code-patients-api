const sqlite3 = require('sqlite3').verbose();
const path = require('path')

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', '..', 'patients.sqlite')

const db  = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Error opening database", err.message)
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS Patients (
            PatientID INTEGER PRIMARY KEY AUTOINCREMENT,
            FirstName TEXT NOT NULL,
            LastName TEXT NOT NULL,
            DateOfBirth TEXT NOT NULL, 
            Gender TEXT,
            Address TEXT,
            ContactPhone TEXT NOT NULL UNIQUE,
            Email TEXT UNIQUE,
            MedicalHistorySummary TEXT,
            RegistrationDate TEXT DEFAULT (datetime('now', 'localtime')),
            LastVisitDate TEXT
        )`, (err) => {
          if (err) {
            console.error("Error creating Patients table", err.message)
          } else {
            console.log("Patients table checked/created successfully")
          }
        })
  }
})

module.exports = db