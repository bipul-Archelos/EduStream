"use client";
import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, LogOut, Play, Video, UserCircle } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState<string>("");
  const [streamUrl, setStreamUrl] = useState<string>("");

  useEffect(() => {
    // Only run on client-side
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("userRole");
    
    if (!token) {
      router.push("/login");
    } else {
      setRole(storedRole);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/upload_video", {
        method: "POST",
        body: formData,
      });
      
      if (res.ok) {
        alert("Video Uploaded Successfully!");
        setFile(null);
      } else {
        alert("Upload failed.");
      }
    } catch (err: unknown) {
      console.error(err);
      alert("Error uploading video");
    } finally {
      setUploading(false);
    }
  };

  const handlePlayVideo = () => {
    if (!videoName) return;
    setStreamUrl(`http://127.0.0.1:8000/video/${videoName}`);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  if (!role) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Video className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">EduStream</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <UserCircle className="h-5 w-5" />
            <span className="capitalize">{role} Account</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Watch Section */}
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Play className="h-5 w-5 text-blue-400" />
              Watch Video
            </h2>
            
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="Enter filename (e.g., demo.mp4)" 
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={videoName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setVideoName(e.target.value)}
              />
              <button 
                onClick={handlePlayVideo}
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Load
              </button>
            </div>

            <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center border border-gray-700 relative group">
              {streamUrl ? (
                <video controls autoPlay className="w-full h-full">
                  <source src={streamUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="text-gray-500 flex flex-col items-center">
                  <Play className="h-12 w-12 mb-2 opacity-50" />
                  <p>Select a video to start streaming</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Upload className="h-5 w-5 text-green-400" />
              Upload Content
            </h2>
            <p className="text-gray-400 text-sm mb-6">Share knowledge with your students.</p>

            <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-gray-500 transition-colors bg-gray-900/50">
              <input 
                type="file" 
                id="video-upload" 
                className="hidden" 
                accept="video/*"
                onChange={handleFileChange}
              />
              
              <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center">
                <div className="bg-gray-800 p-4 rounded-full mb-4">
                  <Upload className="h-8 w-8 text-blue-400" />
                </div>
                <span className="font-medium text-gray-300">
                  {file ? file.name : "Click to select video"}
                </span>
                <span className="text-xs text-gray-500 mt-2">MP4, WebM up to 500MB</span>
              </label>

              {file && (
                <button 
                  onClick={handleUpload}
                  disabled={uploading}
                  className="mt-6 w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  {uploading ? "Uploading..." : "Upload Video Now"}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}