'use client';

import { useState } from 'react';
import CreateNoteModal from './create-note-modal';

interface CreateNoteButtonProps {
  categories: Array<{ id: string; name: string }>;
}

export default function CreateNoteButton({ categories }: CreateNoteButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-5 py-2 rounded-lg bg-zinc-800 text-white text-sm font-medium hover:bg-zinc-900 transition-all"
      >
        + New Note
      </button>
      <CreateNoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        categories={categories}
      />
    </>
  );
}
