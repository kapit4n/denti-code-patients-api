-- CreateTable
CREATE TABLE "Patients" (
    "PatientID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "DateOfBirth" TEXT NOT NULL,
    "Gender" TEXT,
    "Address" TEXT,
    "ContactPhone" TEXT NOT NULL,
    "Email" TEXT,
    "MedicalHistorySummary" TEXT,
    "RegistrationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "LastVisitDate" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "Patients_ContactPhone_key" ON "Patients"("ContactPhone");

-- CreateIndex
CREATE UNIQUE INDEX "Patients_Email_key" ON "Patients"("Email");
