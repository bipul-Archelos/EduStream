"use client";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* Navbar Placeholder (Back button) */}
      <nav className="p-6 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <span className="text-2xl font-bold text-indigo-700 cursor-pointer" onClick={() => router.push('/')}>EduStream 🚀</span>
            <button onClick={() => router.push('/')} className="text-gray-600 hover:text-indigo-600">← Back to Home</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">About EduStream</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
            EduStream is an AI-powered Learning Management System designed to revolutionize online education. 
            We combine high-quality video lectures with the power of <b>Google Gemini AI</b> to provide instant doubt resolution.
        </p>

        <div className="grid md:grid-cols-2 gap-8 my-12">
            <div className="bg-indigo-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-indigo-700 mb-2">Our Mission 🎯</h3>
                <p>To make quality coding education accessible, affordable, and interactive for students worldwide.</p>
            </div>
            <div className="bg-purple-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-purple-700 mb-2">Our Vision 👁️</h3>
                <p>A world where every student has a personal AI tutor to guide them through their learning journey.</p>
            </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Why we built this?</h2>
        <p className="text-gray-600 mb-4">
            Traditional online courses are lonely. You watch a video, get stuck, and give up. 
            With EduStream, you are never alone. Our AI Tutor sits right next to you (virtually), ready to debug your code and explain concepts 24/7.
        </p>
      </div>
    </div>
  );
}