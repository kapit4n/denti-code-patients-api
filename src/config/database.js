const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', '..', 'patients.sqlite');

/**
 * Keeps the SQLite schema in sync when the file was created by an older bootstrap
 * or when Prisma migrations were not run (e.g. `npm run dev` without `./start-denti-stack.sh migrate`).
 */
function ensurePatientColumns(callback) {
  db.all('PRAGMA table_info(Patients)', (pragmaErr, rows) => {
    if (pragmaErr) {
      return callback(pragmaErr);
    }
    const have = new Set((rows || []).map((r) => r.name));
    const alters = [];
    if (!have.has('AuthUserID')) {
      alters.push('ALTER TABLE Patients ADD COLUMN AuthUserID TEXT');
    }
    if (!have.has('AvatarUrl')) {
      alters.push('ALTER TABLE Patients ADD COLUMN AvatarUrl TEXT');
    }

    let i = 0;
    function runNext(err) {
      if (err) return callback(err);
      if (i >= alters.length) return callback(null);
      const sql = alters[i++];
      db.run(sql, runNext);
    }
    runNext(null);
  });
}

const db = new sqlite3.Database(DB_PATH, (openErr) => {
  if (openErr) {
    console.error('Error opening database', openErr.message);
    return;
  }
  db.run(
    `CREATE TABLE IF NOT EXISTS Patients (
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
            LastVisitDate TEXT,
            AuthUserID TEXT,
            AvatarUrl TEXT
        )`,
    (createErr) => {
      if (createErr) {
        console.error('Error creating Patients table', createErr.message);
        return;
      }
      console.log('Patients table checked/created successfully');
      ensurePatientColumns((ensureErr) => {
        if (ensureErr) {
          console.error('Error aligning Patients columns', ensureErr.message);
        } else {
          console.log('Patients column migration check finished');
        }
      });
    },
  );
});

module.exports = db;
