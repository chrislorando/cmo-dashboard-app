'use client';

export default function Sidebar() {
  const excelColumns = [
    'Provider',
    'Hours Worked',
    'Patients Seen',
    'Patients/Hour',
    'Pro E&M',
    'Facility E&M',
    'Shared Visits',
    'Collections Pre-IDR',
    'Collections Post-IDR',
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Productivity Tracking */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">📈</span>
          <h3 className="text-base font-semibold text-gray-900">Productivity Tracking</h3>
        </div>
        <p className="text-xs text-gray-500 mb-3">Excel Workbook Columns</p>
        
        <div className="grid grid-cols-2 gap-1.5 mb-4">
          {excelColumns.map((col) => (
            <div
              key={col}
              className="text-xs text-gray-600 py-1.5 px-2.5 bg-gray-50 rounded border border-gray-100"
            >
              {col}
            </div>
          ))}
        </div>

        <button className="w-full py-2.5 px-4 rounded-lg border-none text-sm font-medium bg-zinc-800 text-white hover:bg-zinc-700 transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0">
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
  );
}
