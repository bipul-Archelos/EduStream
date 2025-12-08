"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { JitsiMeeting } from "@jitsi/react-sdk";
import ChatWidget from "../components/ChatWidget";
import { jwtDecode } from "jwt-decode"; 

interface LiveClass {
  id: number;
  title: string;
  stream_link: string;
}

interface DecodedToken {
  sub: string;
}

export default function LiveClassPage() {
  const [liveClass, setLiveClass] = useState<LiveClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [userEmail, setUserEmail] = useState("student@example.com"); // Variable rename kiya clarity ke liye
  
  const router = useRouter();
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) { 
      router.push("/login"); 
      return; 
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      // Backend mein "sub" = email hai
      setUserEmail(decoded.sub || "student@example.com");
    } catch (e) {
      console.error("Token decode error", e);
    }

    fetchLiveClass();
  }, []);

  const fetchLiveClass = async () => {
    try {
      const res = await axios.get<LiveClass[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/live-classes/`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.length > 0) {
        setLiveClass(res.data[0]);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        setAccessDenied(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-xl bg-gray-900 text-white">Connecting to Classroom... 📡</div>;

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      
      {/* Header */}
      <div className="bg-gray-800 p-3 flex justify-between items-center shadow-md z-10">
        <h1 className="text-lg font-bold text-blue-400 flex items-center gap-2">
           {liveClass ? (
             <>
               <span className="animate-pulse w-3 h-3 bg-red-500 rounded-full"></span>
               LIVE: {liveClass.title}
             </>
           ) : "EduStream Classroom"}
        </h1>
        <button onClick={() => router.push('/dashboard')} className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-sm transition">
          Exit Class
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        
        {accessDenied ? (
          // 🔒 LOCKED SCREEN
          <div className="flex h-full items-center justify-center">
            <div className="bg-gray-800 p-10 rounded-xl text-center shadow-2xl border border-gray-700">
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold mb-2">Premium Only</h2>
              <p className="text-gray-400 mb-6">Upgrade to join this live session.</p>
              <button 
                onClick={() => router.push('/dashboard')}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-full transition transform hover:scale-105"
              >
                Buy Subscription
              </button>
            </div>
          </div>
        ) : liveClass ? (
          // 🎥 JITSI MEETING
          <JitsiMeeting
            domain="meet.jit.si"
            roomName={liveClass.stream_link} 
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
                'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
              ],
            }}
            // 👇 YAHAN FIX KIYA HAI 👇
            userInfo={{
              displayName: userEmail.split('@')[0], // Email ka pehla hissa naam banayenge (e.g., student1)
              email: userEmail // Jitsi ko email chahiye tha, wo yahan de diya
            }}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = "100%";
            }}
          />
        ) : (
          <div className="flex flex-col h-full items-center justify-center text-gray-400">
            <div className="text-6xl mb-4">☕</div>
            <h2 className="text-2xl font-bold">No Class Running</h2>
            <p>Waiting for the teacher to go live...</p>
          </div>
        )}
      </div>

      {/* AI Chatbot Overlay */}
      <ChatWidget />
    </div>
  );
}