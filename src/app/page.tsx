import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-blue-50 to-white">
      <div className="text-center space-y-8 px-4">
        <h1 className="text-5xl font-bold text-gray-900">
          Welcome to CMO Dashboard
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Manage your notes and content efficiently
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
