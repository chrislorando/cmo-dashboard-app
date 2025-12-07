import { getUser } from '@/lib/dal';
import { logout } from '@/app/actions/auth';
import { PrismaClient } from '@prisma/client';
import NoteCard from './note-card';
import CreateNoteButton from './create-note-button';

const prisma = new PrismaClient();

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

  const categories = await prisma.note.findMany({
    where: {
      userId: user.id,
      parentId: null,
      type: 'category',
    },
    include: {
      children: {
        orderBy: [
          { order: 'asc' },
          { createdAt: 'asc' },
        ],
      },
    },
    orderBy: [
      { order: 'asc' },
      { createdAt: 'asc' },
    ],
  });

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
          <div className="flex flex-col gap-5">
            {/* Productivity Tracking */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📈</span>
                <h3 className="text-base font-semibold text-gray-900">Productivity Tracking</h3>
              </div>
              <p className="text-xs text-gray-500 mb-3">Excel Workbook Columns</p>
              
              <div className="grid grid-cols-2 gap-1.5 mb-4">
                {['Provider', 'Hours Worked', 'Patients Seen', 'Patients/Hour', 'Pro E&M', 'Facility E&M', 'Shared Visits', 'Collections Pre-IDR', 'Collections Post-IDR'].map((col) => (
                  <div key={col} className="text-xs text-gray-600 py-1.5 px-2.5 bg-gray-50 rounded border border-gray-100">
                    {col}
                  </div>
                ))}
              </div>

              <button className="w-full py-2.5 px-4 rounded-lg border-none text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0">
                Open Productivity Excel Online
              </button>
            </div>

            {/* BastionGPT Tools */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🤖</span>
                <h3 className="text-base font-semibold text-gray-900">BastionGPT Tools</h3>
              </div>
              <p className="text-xs text-gray-500 mb-3">AI Assistance</p>

              <button className="w-full py-2.5 px-4 rounded-lg border-none text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 mb-2">
                Open Bastion – Peer Review
              </button>
              
              <button className="w-full py-2.5 px-4 rounded-lg border-none text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0">
                Open Bastion – Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
