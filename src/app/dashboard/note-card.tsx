'use client';

import { useState, useEffect } from 'react';
import { updateNote, updateNoteDetails, deleteNote } from '@/app/actions/notes';
import EditNoteModal from './edit-note-modal';
import DeleteNoteModal from './delete-note-modal';

interface Note {
  id: string;
  name: string;
  content: string;
  type: string;
  parentId?: string | null;
  children?: Note[];
}

interface NoteCardProps {
  note: Note;
  icon: string;
  allCategories?: Note[];
}

export default function NoteCard({ note, icon, allCategories = [] }: NoteCardProps) {
  const hasChildren = note.children && note.children.length > 0;
  const [activeTab, setActiveTab] = useState(0);
  const [content, setContent] = useState(hasChildren && note.children ? note.children[0].content : note.content);
  const [saveStatus, setSaveStatus] = useState('');
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [currentNoteId, setCurrentNoteId] = useState(hasChildren && note.children ? note.children[0].id : note.id);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  const activeNote = hasChildren && note.children ? note.children[activeTab] : note;

  // Update content when tab changes
  useEffect(() => {
    if (activeNote && activeNote.id !== currentNoteId) {
      setContent(activeNote.content);
      setCurrentNoteId(activeNote.id);
      setSaveStatus('');
    }
  }, [activeTab, activeNote, currentNoteId]);

  // Auto-save when content changes
  useEffect(() => {
    if (activeNote && content !== activeNote.content) {
      if (saveTimeout) clearTimeout(saveTimeout);

      const timeout = setTimeout(async () => {
        setSaveStatus('Saving...');
        try {
          await updateNote(activeNote.id, content);
          setSaveStatus('Saved just now');
        } catch (error) {
          setSaveStatus('Failed to save');
        }
      }, 1000);

      setSaveTimeout(timeout);
    }
  }, [content]);

  const handleEditNote = (noteToEdit: Note) => {
    setShowEditModal(true);
  };

  const handleSaveEdit = async (newName: string) => {
    await updateNoteDetails(activeNote.id, newName, activeNote.parentId);
  };

  const handleDeleteNote = (note: Note) => {
    setNoteToDelete(note);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;
    await deleteNote(noteToDelete.id);
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <h3 className="text-base font-semibold text-gray-900">{note.name}</h3>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => handleEditNote(activeNote)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => handleDeleteNote(activeNote)}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {hasChildren && note.children && (
        <div className="flex gap-2 mb-3 flex-wrap">
          {note.children.map((child, index) => (
            <button
              key={child.id}
              onClick={() => setActiveTab(index)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === index
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              } border`}
            >
              {child.name}
            </button>
          ))}
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your notes here..."
        className="w-full min-h-[140px] p-3 border border-gray-200 rounded-lg text-sm resize-y focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
      />
      
      {saveStatus && (
        <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
          <span className="font-bold">✓</span>
          {saveStatus}
        </div>
      )}

      {/* Edit Modal */}
      <EditNoteModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        noteName={activeNote.name}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Modal */}
      {noteToDelete && (
        <DeleteNoteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          noteName={noteToDelete.name}
          childCount={noteToDelete.children?.length || 0}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
