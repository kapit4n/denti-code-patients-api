import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type SeedPatient = {
  FirstName: string;
  LastName: string;
  DateOfBirth: string;
  Gender: string | null;
  Address: string | null;
  ContactPhone: string;
  Email: string;
  MedicalHistorySummary: string | null;
};

/** Idempotent: match by Email or ContactPhone so re-seed works after consumer-created rows. */
async function upsertSeedPatient(data: SeedPatient) {
  const existing = await prisma.patients.findFirst({
    where: {
      OR: [{ Email: data.Email }, { ContactPhone: data.ContactPhone }],
    },
  });

  if (existing) {
    await prisma.patients.update({
      where: { PatientID: existing.PatientID },
      data: {
        FirstName: data.FirstName,
        LastName: data.LastName,
        DateOfBirth: data.DateOfBirth,
        Gender: data.Gender,
        Address: data.Address,
        ContactPhone: data.ContactPhone,
        Email: data.Email,
        MedicalHistorySummary: data.MedicalHistorySummary,
      },
    });
  } else {
    await prisma.patients.create({ data });
  }
}

async function main() {
  console.log('Start seeding for Patient Service...');

  await upsertSeedPatient({
    FirstName: 'John',
    LastName: 'Doe',
    DateOfBirth: '1985-05-20',
    Gender: 'Male',
    Address: 'Av. Arce 2519, La Paz, Bolivia',
    ContactPhone: '+59171234567',
    Email: 'patient1@example.com',
    MedicalHistorySummary:
      'No known allergies. History of wisdom tooth extraction in 2010.',
  });

  await upsertSeedPatient({
    FirstName: 'Jane',
    LastName: 'Smith',
    DateOfBirth: '1992-11-15',
    Gender: 'Female',
    Address: 'Calle 21 de Calacoto, La Paz, Bolivia',
    ContactPhone: '+59172345678',
    Email: 'jane.smith@example.com',
    MedicalHistorySummary: 'Allergic to penicillin.',
  });

  await upsertSeedPatient({
    FirstName: 'Carlos',
    LastName: 'Rivera',
    DateOfBirth: '1978-02-10',
    Gender: 'Male',
    Address: 'Av. Ballivián 123, Cochabamba, Bolivia',
    ContactPhone: '+59173456789',
    Email: 'carlos.rivera@example.com',
    MedicalHistorySummary:
      'Requires pre-medication for dental procedures due to a heart condition.',
  });

  await upsertSeedPatient({
    FirstName: 'Sofia',
    LastName: 'Gomez',
    DateOfBirth: '2001-07-30',
    Gender: 'Female',
    Address: 'Calle Warnes 456, Santa Cruz de la Sierra, Bolivia',
    ContactPhone: '+59174567890',
    Email: 'sofia.gomez@example.com',
    MedicalHistorySummary: 'Currently undergoing orthodontic treatment.',
  });

  await upsertSeedPatient({
    FirstName: 'Mateo',
    LastName: 'Vargas',
    DateOfBirth: '1995-09-05',
    Gender: 'Male',
    Address: 'Plaza 25 de Mayo, Sucre, Bolivia',
    ContactPhone: '+59175678901',
    Email: 'mateo.vargas@example.com',
    MedicalHistorySummary: 'History of sensitive teeth.',
  });

  console.log('Seeding for Patient Service finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
