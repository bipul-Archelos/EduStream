"use client";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("subject"); // 'subject' or 'content'
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");
  const router = useRouter();

  // Subject Form State
  const [subjectName, setSubjectName] = useState("");

  // Content Form State
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [contentType, setContentType] = useState("video");
  const [subjectId, setSubjectId] = useState("1");
  const [isPremium, setIsPremium] = useState(true);

  // --- 1. Create Subject ---
  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/subjects/`,
        null, // No body needed, query param use kiya tha backend mein
        {
          params: { name: subjectName },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Subject Created!");
      setSubjectName("");
    } catch (error) {
      alert("❌ Failed. Check if you are Admin.");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Upload Content ---
  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/content/`,
        null,
        {
          params: {
            title: title,
            file_url: fileUrl,
            type: contentType,
            subject_id: subjectId,
            is_premium: isPremium,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Content Uploaded Successfully!");
      setTitle("");
      setFileUrl("");
    } catch (error) {
      alert("❌ Upload Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">🛠️ Admin Control Panel</h1>
          <button onClick={() => router.push('/dashboard')} className="text-sm text-gray-300 hover:text-white">Go to App →</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab("subject")}
            className={`flex-1 py-4 font-bold text-center ${activeTab === 'subject' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Add New Subject
          </button>
          <button 
            onClick={() => setActiveTab("content")}
            className={`flex-1 py-4 font-bold text-center ${activeTab === 'content' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Upload Video / PDF
          </button>
        </div>

        {/* Forms */}
        <div className="p-8">
          
          {/* --- SUBJECT FORM --- */}
          {activeTab === "subject" && (
            <form onSubmit={handleCreateSubject} className="space-y-6 max-w-lg mx-auto">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Subject Name</label>
                <input 
                  className="w-full border p-3 rounded text-black" 
                  placeholder="e.g. Data Structures"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  required
                />
              </div>
              <button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded font-bold hover:bg-indigo-700">
                {loading ? "Creating..." : "Create Subject"}
              </button>
            </form>
          )}

          {/* --- CONTENT FORM --- */}
          {activeTab === "content" && (
            <form onSubmit={handleAddContent} className="space-y-4 max-w-lg mx-auto">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Content Title</label>
                <input 
                  className="w-full border p-2 rounded text-black" 
                  placeholder="e.g. Python Loop Tutorial"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">File URL (Video/PDF Link)</label>
                <input 
                  className="w-full border p-2 rounded text-black" 
                  placeholder="https://..."
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 font-bold mb-1">Type</label>
                  <select 
                    className="w-full border p-2 rounded text-black"
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                  >
                    <option value="video">Video 🎥</option>
                    <option value="pdf">PDF Notes 📄</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-bold mb-1">Subject ID</label>
                  <input 
                    type="number"
                    className="w-full border p-2 rounded text-black" 
                    placeholder="e.g. 1"
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 bg-yellow-50 p-3 rounded border border-yellow-200">
                <input 
                  type="checkbox" 
                  id="prem"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="w-5 h-5 text-indigo-600"
                />
                <label htmlFor="prem" className="text-gray-800 font-semibold cursor-pointer">
                  Is Premium Content? (Lock for free users)
                </label>
              </div>

              <button disabled={loading} className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700">
                {loading ? "Uploading..." : "Upload Content"}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}