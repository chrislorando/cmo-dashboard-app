// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
   // 1. Create User (Jon)
  const hashedPassword = await bcrypt.hash('password', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'jon@example.com' },
    update: {},
    create: {
      email: 'jon@example.com',
      password: hashedPassword,
      name: 'Jon',
    },
  });

  console.log('✅ User created:', user.email);


  // 1. Corp CMO/COO (category)
  const corpCMO = await prisma.note.create({
    data: {
      userId: user.id,
      type: 'category',
      name: 'Corp CMO/COO',
      order: 1,
      content: '• Lorem ipsum dolor sit amet, consectetur adipiscing elit\n• Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua\n• Ut enim ad minim veniam, quis nostrud exercitation ullamco\n• Duis aute irure dolor in reprehenderit in voluptate velit esse',
    },
  });


  // 2. CMO General (category)
  const cmoGeneral = await prisma.note.create({
    data: {
      userId: user.id,
      type: 'category',
      name: 'CMO General',
      order: 2,
      content: '• Lorem ipsum dolor sit amet, consectetur adipiscing elit\n• Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua\n• Ut enim ad minim veniam, quis nostrud exercitation ullamco\n• Duis aute irure dolor in reprehenderit in voluptate velit esse',
    },
  });


  // 3. CNO/FMD General (category)
  const cnoFMD = await prisma.note.create({
    data: {
      userId: user.id,
      type: 'category',
      name: 'CNO/FMD',
      order: 3,
      content: '• Lorem ipsum dolor sit amet, consectetur adipiscing elit\n• Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua\n• Ut enim ad minim veniam, quis nostrud exercitation ullamco\n• Duis aute irure dolor in reprehenderit in voluptate velit esse',
    },
  });

  // 4. CNO/FMD Facility (category dengan subcategories)
  const cnoFacility = await prisma.note.create({
    data: {
      userId: user.id,
      type: 'category',
      name: 'CNO/FMD Facility',
      order: 4,
      content: '• Lorem ipsum dolor sit amet, consectetur adipiscing elit\n• Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua\n• Ut enim ad minim veniam, quis nostrud exercitation ullamco\n• Duis aute irure dolor in reprehenderit in voluptate velit esse',
    },
  });

  const facilities = [
    { name: 'Yuma', order: 1 },
    { name: 'Prescott', order: 2 },
    { name: 'Maricopa', order: 3 },
    { name: 'Bullhead City', order: 4 },
    { name: 'Eloy', order: 5 },
  ];

  for (const facility of facilities) {
    const subCategory = await prisma.note.create({
      data: {
        userId: user.id,
        parentId: cnoFacility.id,
        type: 'subcategory',
        name: facility.name,
        order: facility.order,
        content: `• Lorem ipsum dolor sit amet, consectetur adipiscing elit\n• Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua\n• Ut enim ad minim veniam, quis nostrud exercitation ullamco\n• Duis aute irure dolor in reprehenderit in voluptate velit esse\n• ${facility.name} facility specific notes and updates`,
      },
    });
  }

  // 5. Productivity (category)
  const productivity = await prisma.note.create({
    data: {
      userId: user.id,
      type: 'category',
      name: 'Productivity',
      order: 5,
      content: '• Lorem ipsum dolor sit amet, consectetur adipiscing elit\n• Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua\n• Ut enim ad minim veniam, quis nostrud exercitation ullamco\n• Duis aute irure dolor in reprehenderit in voluptate velit esse',
    },
  });

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });