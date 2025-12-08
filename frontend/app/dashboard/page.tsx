"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import ChatWidget from "../components/ChatWidget";
import Script from "next/script";

interface ContentItem {
  title: string;
  access: "LOCKED 🔒" | "OPEN ✅";
  url: string;
  content_type: "video" | "pdf";
}

interface UserProfile {
  id: number;
  email: string;
  plan: string;
  days_left: number;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [content, setContent] = useState<ContentItem[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  
  // --- NEW: NOTES STATE ---
  const [myNote, setMyNote] = useState("");

  const router = useRouter();
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) { router.push("/login"); return; }
    
    const fetchData = async () => {
      try {
        const profileRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile`, { headers: { Authorization: `Bearer ${token}` } });
        setProfile(profileRes.data);

        const contentRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/study-material/1`, { headers: { Authorization: `Bearer ${token}` } });
        setContent(contentRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- NEW: FETCH NOTES WHEN VIDEO OPENS ---
  useEffect(() => {
     if(selectedVideo) {
        // Filhal Subject ID 1 ke liye note mangwa rahe hain
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notes/1`, { headers: { Authorization: `Bearer ${token}` } })
             .then(res => setMyNote(res.data.content))
             .catch(err => console.log("No existing notes"));
     }
  }, [selectedVideo]);

  // --- NEW: SAVE NOTE FUNCTION ---
  const saveNote = async () => {
     try {
       await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notes`, { content: myNote, subject_id: 1 }, { headers: { Authorization: `Bearer ${token}` } });
       alert("Note Saved Successfully! 📝");
     } catch (error) {
       alert("Failed to save note.");
     }
  }

  // Payment Logic
  const handlePayment = async () => {
    if (!isRazorpayLoaded) return alert("Payment SDK loading...");
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/create-order?amount=499`, {}, { headers: { Authorization: `Bearer ${token}` } });
        const options = {
            key: "YOUR_RAZORPAY_TEST_KEY", // ⚠️ Replace with Key
            amount: res.data.amount,
            currency: "INR",
            name: "EduStream Pro",
            description: "Premium Subscription",
            order_id: res.data.id,
            handler: async function (response: any) {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/buy-subscription/?plan_id=1`, {}, { headers: { Authorization: `Bearer ${token}` } });
                window.location.reload();
            },
        };
        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
    } catch (error) { alert("Payment Failed"); }
  };

  const totalVideos = content.filter(i => i.content_type === 'video').length;
  const totalPDFs = content.filter(i => i.content_type === 'pdf').length;

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50 text-indigo-600 font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setIsRazorpayLoaded(true)} />

      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 text-2xl font-bold tracking-wide border-b border-indigo-800">EduStream 🚀</div>
        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem icon="📊" label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarItem icon="🎓" label="My Classroom" active={activeTab === 'classroom'} onClick={() => setActiveTab('classroom')} />
          <SidebarItem icon="📥" label="Resources" active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} />
        </nav>
        <div className="p-4 border-t border-indigo-800">
           <p className="text-sm font-semibold truncate">{profile?.email.split('@')[0]}</p>
           <button onClick={() => { Cookies.remove('token'); router.push('/login'); }} className="text-red-300 text-sm hover:text-white mt-2">Logout</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
             <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon="🎥" label="Videos" value={totalVideos} color="bg-purple-50 text-purple-600" />
                <StatCard icon="📄" label="PDF Files" value={totalPDFs} color="bg-orange-50 text-orange-600" />
                <StatCard icon="⏳" label="Days Left" value={profile?.days_left + " Days"} color="bg-green-50 text-green-600" />
             </div>
          </div>
        )}

        {/* Classroom Tab */}
        {activeTab === 'classroom' && (
          <div>
             <h1 className="text-3xl font-bold text-gray-800 mb-6">My Classroom 🎓</h1>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.map((item, index) => (
                   <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                      <div className={`h-40 flex items-center justify-center text-6xl ${item.content_type === 'video' ? 'bg-indigo-50 text-indigo-500' : 'bg-red-50 text-red-500'}`}>
                         {item.content_type === 'video' ? '▶' : '📄'}
                      </div>
                      <div className="p-5">
                         <h3 className="font-bold text-gray-800 mb-4 truncate">{item.title}</h3>
                         {item.access.includes("LOCKED") ? (
                            <button onClick={handlePayment} className="w-full bg-gray-200 text-gray-500 py-2 rounded-lg font-bold cursor-not-allowed">Locked 🔒</button>
                         ) : (
                            <button 
                               onClick={() => item.content_type === 'video' ? setSelectedVideo(item.url) : window.open(item.url, '_blank')}
                               className={`w-full py-2 rounded-lg font-bold text-white transition ${item.content_type === 'video' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-red-600 hover:bg-red-700'}`}
                            >
                               {item.content_type === 'video' ? "Watch Now" : "Download PDF"}
                            </button>
                         )}
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}
      </main>

      {/* --- MODAL UPDATED WITH NOTES --- */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedVideo(null)}>
          <div className="w-full max-w-4xl bg-white rounded-xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
             
             {/* 1. Video Player Section */}
             <div className="bg-black relative aspect-video">
                <video controls autoPlay className="w-full h-full">
                    <source src={selectedVideo} type="video/mp4" />
                </video>
                <button onClick={() => setSelectedVideo(null)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center">✕</button>
             </div>

             {/* 2. Notes Section (Added Here) */}
             <div className="p-6 bg-gray-50 flex-1 overflow-y-auto">
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-800 text-lg">My Private Notes 📝</h3>
                    <span className="text-xs text-gray-500">Only visible to you</span>
                 </div>
                 
                 <textarea 
                    className="w-full border border-gray-300 p-3 rounded-lg h-32 text-black focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
                    placeholder="Write key takeaways from this video here..."
                    value={myNote}
                    onChange={(e) => setMyNote(e.target.value)}
                 />
                 
                 <div className="flex justify-end mt-3">
                    <button 
                        onClick={saveNote} 
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 shadow-md transition"
                    >
                        Save Note
                    </button>
                 </div>
             </div>

          </div>
        </div>
      )}

      <ChatWidget />
    </div>
  );
}

// Sub-components
function SidebarItem({ icon, label, active, onClick }: any) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${active ? 'bg-indigo-700 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}`}>
            <span>{icon}</span><span>{label}</span>
        </button>
    )
}

function StatCard({ icon, label, value, color }: any) {
    return (
        <div className={`p-6 rounded-xl shadow-sm border border-gray-100 bg-white flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${color}`}>{icon}</div>
            <div>
                <p className="text-gray-500 text-sm font-bold uppercase">{label}</p>
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            </div>
        </div>
    )
}