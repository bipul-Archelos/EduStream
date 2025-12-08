"use client";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { JitsiMeeting } from "@jitsi/react-sdk";

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("live"); // 'live' or 'upload'
  const [loading, setLoading] = useState(false);
  
  // Live Class Form
  const [classTitle, setClassTitle] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isClassStarted, setIsClassStarted] = useState(false);

  // Upload Content Form
  const [contentTitle, setContentTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [contentType, setContentType] = useState("video");
  const [subjectId, setSubjectId] = useState("1"); // Default Subject ID 1

  const router = useRouter();
  const token = Cookies.get("token");

  // --- 1. START LIVE CLASS ---
  const handleStartClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend ko batao ki class shuru ho gayi
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/live-sessions/`,
        {
          title: classTitle,
          stream_link: roomName, // Jitsi Room Name
          subject_id: Number(subjectId)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("🔴 Class Started! You are now Live.");
      setIsClassStarted(true); // Jitsi Player Show karega
    } catch (error) {
      alert("❌ Error: Login as Admin/Teacher first.");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. UPLOAD CONTENT ---
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/content/`,
        null,
        {
          params: {
            title: contentTitle,
            file_url: fileUrl,
            type: contentType,
            subject_id: subjectId,
            is_premium: true,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Content Uploaded!");
      setContentTitle("");
      setFileUrl("");
    } catch (error) {
      alert("❌ Upload Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Header */}
      <div className="bg-indigo-900 text-white p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold">👨‍🏫 Trainer Dashboard</h1>
        <div className="flex gap-4">
            <button onClick={() => setIsClassStarted(false)} className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600">Stop Class</button>
            <button onClick={() => router.push('/dashboard')} className="bg-indigo-600 px-3 py-1 rounded text-sm hover:bg-indigo-500">View App</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white shadow-sm mb-6">
        <button 
          onClick={() => { setActiveTab("live"); setIsClassStarted(false); }}
          className={`flex-1 py-4 font-bold ${activeTab === 'live' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'}`}
        >
          🔴 Go Live
        </button>
        <button 
          onClick={() => setActiveTab("upload")}
          className={`flex-1 py-4 font-bold ${activeTab === 'upload' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          📤 Upload Material
        </button>
      </div>

      {/* --- LIVE CLASS SECTION --- */}
      {activeTab === "live" && (
        <div className="flex-1 flex flex-col items-center p-4">
          
          {!isClassStarted ? (
            // Form to Start Class
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Start a Live Session</h2>
              <form onSubmit={handleStartClass} className="space-y-4">
                <div>
                  <label className="block font-semibold mb-1 text-black">Class Title</label>
                  <input 
                    className="w-full border p-2 rounded text-black" 
                    placeholder="e.g. Python Doubt Session"
                    value={classTitle}
                    onChange={(e) => setClassTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-black">Room Name (Unique)</label>
                  <input 
                    className="w-full border p-2 rounded text-black" 
                    placeholder="e.g. ClassRoom101"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Students will join using this room name.</p>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-black">Subject ID</label>
                  <input 
                    type="number" 
                    className="w-full border p-2 rounded text-black" 
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    required
                  />
                </div>
                <button disabled={loading} className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition">
                  {loading ? "Starting..." : "🚀 GO LIVE NOW"}
                </button>
              </form>
            </div>
          ) : (
            // JITSI MEETING (Teacher View)
            <div className="w-full h-[80vh] bg-black rounded-xl overflow-hidden shadow-2xl relative">
               <JitsiMeeting
                domain="meet.jit.si"
                roomName={roomName}
                configOverwrite={{
                  startWithAudioMuted: true,
                  disableThirdPartyRequests: true,
                  prejoinPageEnabled: false,
                }}
                interfaceConfigOverwrite={{
                   TOOLBAR_BUTTONS: [
                    'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                    'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                    'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                    'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
                    'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                    'security' // Teacher needs Security options (Kick/Mute)
                  ],
                }}
                userInfo={{
                  displayName: "Teacher (Host)"
                }}
                getIFrameRef={(iframeRef) => { iframeRef.style.height = "100%"; }}
              />
            </div>
          )}
        </div>
      )}

      {/* --- UPLOAD SECTION --- */}
      {activeTab === "upload" && (
        <div className="flex justify-center p-6">
          <form onSubmit={handleUpload} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Upload Study Material</h2>
            <input 
              className="w-full border p-2 rounded text-black" 
              placeholder="Title" 
              value={contentTitle} onChange={(e) => setContentTitle(e.target.value)} required 
            />
            <input 
              className="w-full border p-2 rounded text-black" 
              placeholder="File/Video URL" 
              value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} required 
            />
            <select 
              className="w-full border p-2 rounded text-black"
              value={contentType} onChange={(e) => setContentType(e.target.value)}
            >
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
            </select>
            <input 
              type="number" className="w-full border p-2 rounded text-black"
              placeholder="Subject ID (1)" 
              value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required 
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
              Upload Content
            </button>
          </form>
        </div>
      )}
    </div>
  );
}