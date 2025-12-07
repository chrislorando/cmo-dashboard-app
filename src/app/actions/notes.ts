'use server';

import { verifySession } from '@/lib/dal';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function getNotes() {
  const session = await verifySession();

  const notes = await prisma.note.findMany({
    where: {
      userId: session.userId,
    },
    orderBy: [
      { order: 'asc' },
    ],
  });

  console.log(notes)

  return notes;
}

export async function updateNote(noteId: string, content: string) {
  const session = await verifySession();

  const note = await prisma.note.update({
    where: {
      id: noteId,
      userId: session.userId,
    },
    data: {
      content,
      updatedAt: new Date(),
    },
  });

  revalidatePath('/dashboard');
  return note;
}

export async function createNote(
  name: string,
  type: string,
  content: string,
  parentId?: string
) {
  const session = await verifySession();

  const note = await prisma.note.create({
    data: {
      userId: session.userId,
      name,
      type,
      content,
      parentId,
    },
  });

  revalidatePath('/dashboard');
  return note;
}

export async function updateNoteDetails(
  noteId: string,
  name: string,
  parentId?: string | null
) {
  const session = await verifySession();

  const note = await prisma.note.update({
    where: {
      id: noteId,
      userId: session.userId,
    },
    data: {
      name,
      parentId: parentId === null ? null : parentId,
      updatedAt: new Date(),
    },
  });

  revalidatePath('/dashboard');
  return note;
}

export async function deleteNote(noteId: string) {
  const session = await verifySession();

  await prisma.note.delete({
    where: {
      id: noteId,
      userId: session.userId,
    },
  });

  revalidatePath('/dashboard');
}
