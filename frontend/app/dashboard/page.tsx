"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import ChatWidget from "../components/ChatWidget"; // <--- Import Chatbot

interface ContentItem {
  title: string;
  access: "LOCKED 🔒" | "OPEN ✅";
  url: string | null;
  content_type: string; // Add logic backend to send 'video' or 'pdf'
}

export default function Dashboard() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null); // For Video Player
  const router = useRouter();
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) { router.push("/login"); return; }
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await axios.get<ContentItem[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/study-material/1`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent(res.data);
    } catch (error) { console.error(error); }
  };

  const buySubscription = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/buy-subscription/?plan_id=1`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert("Plan Purchased! 🎉");
      fetchContent();
    } catch (error) { alert("Failed"); }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      
      {/* Navbar type header */}
      <div className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-blue-700">EduStream Dashboard</h1>
        <button onClick={() => { Cookies.remove('token'); router.push('/login'); }} className="text-red-500 font-semibold">Logout</button>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {/* Subscription Banner */}
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-6 rounded-xl shadow-sm mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-yellow-800">Unlock Premium Access 🔓</h2>
            <p className="text-yellow-700 text-sm">Get unlimited access to AI Tutor and HD Videos.</p>
          </div>
          <button onClick={buySubscription} className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
            Buy Premium (₹499)
          </button>
        </div>

        {/* Content Grid */}
        <h2 className="text-xl font-bold mb-4 text-gray-700">Course Content: Python</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item, index) => (
            <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-4xl">
                {item.content_type === "video" ? "🎥" : "📄"}
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 truncate">{item.title}</h3>
              
              {item.access.includes("LOCKED") ? (
                <button disabled className="w-full bg-gray-200 text-gray-500 py-2 rounded-lg cursor-not-allowed flex justify-center items-center gap-2">
                  <span>Locked</span> 🔒
                </button>
              ) : (
                <button 
                  onClick={() => {
                     // Agar video hai to player kholo, nahi to link
                     if(item.url) setSelectedVideo(item.url); 
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Play Video ▶
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* VIDEO PLAYER MODAL (Popup) */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="bg-black w-full max-w-4xl rounded-lg overflow-hidden relative shadow-2xl">
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-red-500 z-10 bg-black/50 px-3 rounded-full"
            >
              ✕
            </button>
            <video controls autoPlay className="w-full h-auto max-h-[80vh]">
              <source src={selectedVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      {/* AI CHATBOT WIDGET */}
      <ChatWidget />
      
    </div>
  );
}