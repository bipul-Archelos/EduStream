"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: number;
  email: string;
  username: string;
  plan: string;
  days_left: number;
  expiry_date: string | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(res.data);
    } catch (error) {
      console.error("Error fetching profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-gray-500">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6">
      
      {/* Navbar / Header */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-indigo-700 cursor-pointer" onClick={() => router.push('/dashboard')}>
            ← Back to Dashboard
        </h1>
        <button onClick={handleLogout} className="text-red-500 font-semibold border border-red-200 px-4 py-2 rounded hover:bg-red-50">
            Logout
        </button>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: User Info Card */}
        <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
                {/* Avatar Placeholder */}
                <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                    {profile?.email[0].toUpperCase()}
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 break-words">{profile?.email.split('@')[0]}</h2>
                <p className="text-gray-500 text-sm mb-6">{profile?.email}</p>

                <div className="bg-gray-50 rounded-lg p-4 text-left">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">Current Plan</p>
                    <div className="flex justify-between items-center">
                        <span className={`font-bold ${profile?.plan !== 'Free Plan' ? 'text-green-600' : 'text-gray-600'}`}>
                            {profile?.plan}
                        </span>
                        {profile?.plan !== 'Free Plan' && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Active</span>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: Stats & Subscription Details */}
        <div className="md:col-span-2 space-y-6">
            
            {/* Subscription Status */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-8 border-indigo-600">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Subscription Details</h3>
                
                {profile?.plan === 'Free Plan' ? (
                    <div>
                        <p className="text-gray-600 mb-4">You are currently on the Free Tier. Upgrade to access Premium Videos & Live Classes.</p>
                        <button 
                            onClick={() => router.push('/dashboard')}
                            className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-300 transition"
                        >
                            Upgrade to Premium ⚡
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-indigo-50 p-4 rounded-lg">
                            <p className="text-gray-500 text-sm">Days Remaining</p>
                            <p className="text-2xl font-bold text-indigo-700">{profile?.days_left} Days</p>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-lg">
                            <p className="text-gray-500 text-sm">Expiry Date</p>
                            <p className="text-xl font-bold text-indigo-700">
                                {profile?.expiry_date ? new Date(profile.expiry_date).toLocaleDateString() : "N/A"}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Learning Stats (Dummy for now) */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">My Learning Progress 📊</h3>
                
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Python Programming</span>
                            <span className="text-sm font-medium text-gray-700">45%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: "45%"}}></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Web Development</span>
                            <span className="text-sm font-medium text-gray-700">20%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-purple-600 h-2.5 rounded-full" style={{width: "20%"}}></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}