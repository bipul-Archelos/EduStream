"use client";
import { useState, useEffect, ChangeEvent } from 'react';

export default function Dashboard() {
  const [role, setRole] = useState<string>("");
  const [videos, setVideos] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    // LocalStorage se role nikalo
    const userRole = localStorage.getItem("userRole");
    if (userRole) setRole(userRole);
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch("http://localhost:8000/videos");
      if (res.ok) {
        const data: string[] = await res.json();
        if (Array.isArray(data)) setVideos(data);
      }
    } catch (e) {
      console.error("Failed to fetch videos", e);
    }
  };

  // File Input Handler (TypeScript specific)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Upload Successful! 🎉");
        setFile(null); // Reset file
        fetchVideos(); // Refresh list
      } else {
        alert("Upload Failed ❌");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Backend connection failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          EduStream <span className="text-sm bg-gray-700 px-3 py-1 rounded-full text-yellow-400 ml-2">{role.toUpperCase()}</span>
        </h1>
        <button onClick={() => window.location.href='/'} className="text-sm text-gray-400 hover:text-white">Logout</button>
      </div>

      {/* TRAINER SECTION */}
      {role === "trainer" && (
        <div className="mb-12 p-6 bg-gray-800 rounded-lg border border-purple-500/50 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">Upload New Course Video</h2>
          <div className="flex gap-4 items-center">
            <input 
              type="file" 
              accept="video/*"
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
              onChange={handleFileChange} 
            />
            <button 
              onClick={handleUpload} 
              disabled={uploading}
              className={`px-6 py-2 rounded-full font-bold transition ${uploading ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-500'}`}
            >
              {uploading ? "Uploading..." : "Upload 🚀"}
            </button>
          </div>
        </div>
      )}

      {/* VIDEO LIST */}
      <h2 className="text-2xl font-bold mb-6 text-blue-400 border-b border-gray-700 pb-2">Available Courses</h2>
      
      {videos.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No videos uploaded yet. {role === 'trainer' ? 'Upload one above!' : 'Ask your trainer to upload.'}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((vid, idx) => (
            <div key={idx} className="bg-gray-800 p-4 rounded-xl shadow-xl hover:shadow-2xl transition border border-gray-700">
              <h3 className="text-lg font-semibold mb-3 text-gray-200 truncate">{vid}</h3>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video controls className="w-full h-full object-cover">
                  <source src={`http://localhost:8000/stream/${vid}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}