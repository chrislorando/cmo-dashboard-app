'use client';

import { useState, useEffect } from 'react';
import { updateNote } from '@/app/actions/notes';

interface FacilityNote {
  id: string;
  name: string;
  displayName: string;
  content: string;
}

interface FacilityNotesProps {
  title: string;
  icon: string;
  facilities: FacilityNote[];
}

export default function FacilityNotes({ title, icon, facilities }: FacilityNotesProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [content, setContent] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const activeFacility = facilities[activeTab];

  useEffect(() => {
    if (activeFacility) {
      setContent(activeFacility.content);
    }
  }, [activeTab, activeFacility]);

  useEffect(() => {
    if (activeFacility && content !== activeFacility.content) {
      if (saveTimeout) clearTimeout(saveTimeout);

      const timeout = setTimeout(async () => {
        setSaveStatus('Saving...');
        try {
          await updateNote(activeFacility.id, content);
          setSaveStatus('Saved just now');
        } catch (error) {
          setSaveStatus('Failed to save');
        }
      }, 1000);

      setSaveTimeout(timeout);
    }
  }, [content, activeFacility]);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 col-span-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="flex gap-2 mb-3 flex-wrap">
        {facilities.map((facility, index) => (
          <button
            key={facility.id}
            onClick={() => setActiveTab(index)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === index
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            } border`}
          >
            {facility.displayName}
          </button>
        ))}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type notes for selected facility..."
        className="w-full min-h-[140px] p-3 border border-gray-200 rounded-lg text-sm resize-y focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
      />
      
      {saveStatus && (
        <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
          <span className="font-bold">✓</span>
          {saveStatus}
        </div>
      )}
    </div>
  );
}
