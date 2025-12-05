import Link from 'next/link';
import { PlayCircle } from 'lucide-react';
import React from 'react';

export default function Home(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="flex justify-center mb-6">
          <PlayCircle className="w-20 h-20 text-blue-500" />
        </div>
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
          Welcome to <span className="text-blue-500">EduStream</span>
        </h1>
        <p className="text-xl text-gray-300 mb-10 leading-relaxed">
          The next-generation platform for trainers and students. 
          Upload courses, stream high-quality video, and learn at your own pace.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link href="/login" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-bold text-lg transition-transform hover:scale-105">
            Login
          </Link>
          <Link href="/register" className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-full font-bold text-lg transition-all">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}