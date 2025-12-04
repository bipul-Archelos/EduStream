"use client";
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [role, setRole] = useState("");
  const [videos, setVideos] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    // Check karo ki User Student hai ya Trainer
    const userRole = localStorage.getItem("userRole");
    if (userRole) setRole(userRole);
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch("http://localhost:8000/videos");
      const data = await res.json();
      if (Array.isArray(data)) setVideos(data);
    } catch (e) {
      console.error("Video fetch failed");
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Upload Successful!");
      fetchVideos(); // List refresh karo
    } else {
      alert("Upload Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-8">
        EduStream Dashboard <span className="text-sm bg-gray-700 px-2 py-1 rounded text-yellow-400">{role.toUpperCase()}</span>
      </h1>

      {/* Sirf Trainer ko Upload ka button dikhega */}
      {role === "trainer" && (
        <div className="mb-12 p-6 bg-gray-800 rounded-lg border border-purple-500">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">Upload New Course Video</h2>
          <div className="flex gap-4">
            <input type="file" className="p-2 bg-gray-700 rounded text-white" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button onClick={handleUpload} className="bg-purple-600 px-6 py-2 rounded font-bold hover:bg-purple-500">
              Upload 🚀
            </button>
          </div>
        </div>
      )}

      {/* Video List - Sabko dikhegi */}
      <h2 className="text-2xl font-bold mb-6 text-blue-400">Available Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videos.map((vid, idx) => (
          <div key={idx} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-200">{vid}</h3>
            <video controls className="w-full rounded-lg border border-gray-700">
              <source src={`http://localhost:8000/stream/${vid}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
        {videos.length === 0 && <p className="text-gray-500">No videos uploaded yet.</p>}
      </div>
    </div>
  );
}