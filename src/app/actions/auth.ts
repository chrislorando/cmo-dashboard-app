'use server';

import { SignupFormSchema, LoginFormSchema, FormState } from '@/lib/definitions';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function signup(state: FormState, formData: FormData) {
  // 1. Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Prepare data for insertion into database
  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      message: 'An account with this email already exists.',
    };
  }

  // 4. Insert the user into the database
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (!user) {
      return {
        message: 'An error occurred while creating your account.',
      };
    }

    // 5. Create user session
    await createSession(user.id);
  } catch (error) {
    return {
      message: 'Database error: Failed to create user.',
    };
  }

  // 6. Redirect user
  redirect('/dashboard');
}

export async function login(state: FormState, formData: FormData) {
  // 1. Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Query the database for the user with the given email
  const { email, password } = validatedFields.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      message: 'Invalid email or password.',
    };
  }

  // 3. Compare the user's password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return {
      message: 'Invalid email or password.',
    };
  }

  // 4. If login successful, create a session for the user
  await createSession(user.id);

  // 5. Redirect user
  redirect('/dashboard');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
