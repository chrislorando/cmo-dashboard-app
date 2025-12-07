import { getUser } from '@/lib/dal';
import { logout } from '@/app/actions/auth';
import { getNotes } from '@/app/actions/notes';
import NoteCard from './note-card';
import CreateNoteButton from './create-note-button';
import Sidebar from './sidebar';

const iconMap: Record<string, string> = {
  corp_cmo_coo: '📋',
  cmo_general: '💼',
  cno_fmd_general: '🏥',
  productivity: '📊',
  cno_fmd_facilities: '🏢',
};

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User not found</h2>
          <p className="text-gray-600 mb-4">Please try logging in again.</p>
          <form action={logout}>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            >
              Logout & Return to Login
            </button>
          </form>
        </div>
      </div>
    );
  }

const allNotes = await getNotes();
  const categories = allNotes.filter(note => 
    note.parentId === null && note.type === 'category'
  ).map(category => ({
    ...category,
    children: allNotes.filter(note => note.parentId === category.id)
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-7 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">CMO / FMD Dashboard</h1>
          <div className="flex gap-3">
            <CreateNoteButton categories={categories} />
            <form action={logout}>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-5">
          {/* Notes Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {categories.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No notes yet. Start by creating your first note!</p>
              </div>
            ) : (
              categories.map((category: any) => (
                <NoteCard
                  key={category.id}
                  note={category}
                  icon={iconMap[category.name] || '📝'}
                  allCategories={categories}
                />
              ))
            )}
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
