'use client';

import { useState } from 'react';

interface DeleteNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteName: string;
  childCount?: number;
  onConfirm: () => Promise<void>;
}

export default function DeleteNoteModal({ 
  isOpen, 
  onClose, 
  noteName, 
  childCount = 0,
  onConfirm 
}: DeleteNoteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      alert('Failed to delete note');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-50 z-50" onClick={onClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl pointer-events-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Note</h3>
          
          <p className="text-gray-600 mb-6">
            {childCount > 0 ? (
              <>
                Are you sure you want to delete <strong>{noteName}</strong> and all its <strong>{childCount}</strong> child note(s)?
              </>
            ) : (
              <>
                Are you sure you want to delete <strong>{noteName}</strong>?
              </>
            )}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
