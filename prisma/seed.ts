import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding for Patient Service...');

  await prisma.patients.upsert({
    where: { ContactPhone: '+59171234567' },
    update: {},
    create: {
      FirstName: 'John',
      LastName: 'Doe',
      DateOfBirth: '1985-05-20',
      Gender: 'Male',
      Address: 'Av. Arce 2519, La Paz, Bolivia',
      ContactPhone: '+59171234567',
      Email: 'john.doe@example.com',
      MedicalHistorySummary: 'No known allergies. History of wisdom tooth extraction in 2010.',
    },
  });

  await prisma.patients.upsert({
    where: { ContactPhone: '+59172345678' },
    update: {},
    create: {
      FirstName: 'Jane',
      LastName: 'Smith',
      DateOfBirth: '1992-11-15',
      Gender: 'Female',
      Address: 'Calle 21 de Calacoto, La Paz, Bolivia',
      ContactPhone: '+59172345678',
      Email: 'jane.smith@example.com',
      MedicalHistorySummary: 'Allergic to penicillin.',
    },
  });

  await prisma.patients.upsert({
    where: { ContactPhone: '+59173456789' },
    update: {},
    create: {
      FirstName: 'Carlos',
      LastName: 'Rivera',
      DateOfBirth: '1978-02-10',
      Gender: 'Male',
      Address: 'Av. Ballivián 123, Cochabamba, Bolivia',
      ContactPhone: '+59173456789',
      Email: 'carlos.rivera@example.com',
      MedicalHistorySummary: 'Requires pre-medication for dental procedures due to a heart condition.',
    },
  });

  await prisma.patients.upsert({
    where: { ContactPhone: '+59174567890' },
    update: {},
    create: {
      FirstName: 'Sofia',
      LastName: 'Gomez',
      DateOfBirth: '2001-07-30',
      Gender: 'Female',
      Address: 'Calle Warnes 456, Santa Cruz de la Sierra, Bolivia',
      ContactPhone: '+59174567890',
      Email: 'sofia.gomez@example.com',
      MedicalHistorySummary: 'Currently undergoing orthodontic treatment.',
    },
  });

  await prisma.patients.upsert({
    where: { ContactPhone: '+59175678901' },
    update: {},
    create: {
      FirstName: 'Mateo',
      LastName: 'Vargas',
      DateOfBirth: '1995-09-05',
      Gender: 'Male',
      Address: 'Plaza 25 de Mayo, Sucre, Bolivia',
      ContactPhone: '+59175678901',
      Email: 'mateo.vargas@example.com',
      MedicalHistorySummary: 'History of sensitive teeth.',
    },
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