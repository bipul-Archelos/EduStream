"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSubmitted(true);
    // Real app mein yahan API call hogi
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="p-6 bg-white border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <span className="text-2xl font-bold text-indigo-700 cursor-pointer" onClick={() => router.push('/')}>EduStream 🚀</span>
            <button onClick={() => router.push('/')} className="text-gray-600 hover:text-indigo-600">← Back to Home</button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto py-16 px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {!submitted ? (
                <>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Get in touch 📬</h1>
                    <p className="text-gray-500 mb-8">Have questions about our Premium Plans? We'd love to hear from you.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                            <input required className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                            <input type="email" required className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="john@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                            <textarea required className="w-full border p-3 rounded-lg h-32 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="How can we help you?" />
                        </div>
                        <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition">Send Message</button>
                    </form>
                </>
            ) : (
                <div className="text-center py-10">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-gray-800">Message Sent!</h2>
                    <p className="text-gray-500 mt-2">Our team will get back to you within 24 hours.</p>
                    <button onClick={() => router.push('/')} className="mt-6 text-indigo-600 font-bold hover:underline">Go Home</button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}