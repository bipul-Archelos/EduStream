"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1. Client-side Validation
    if (password !== confirmPass) {
        setError("Passwords do not match!");
        setLoading(false);
        return;
    }
    if (password.length < 4) {
        setError("Password must be at least 4 characters.");
        setLoading(false);
        return;
    }

    try {
      // 2. Backend Call
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        email: email,
        password: password,
        role: "student"
      });

      // 3. Success Redirect
      alert("Account Created Successfully! 🎉 Redirecting to Login...");
      router.push("/login");

    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError("This email is already registered. Please Login.");
      } else {
        setError("Registration failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* --- LEFT SIDE: REGISTER FORM --- */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 animate-fade-in-up">
        <div className="w-full max-w-md space-y-6">
          
          {/* Header */}
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Start your journey 🚀
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Join thousands of learners on <span className="text-indigo-600 font-bold">EduStream</span> today.
            </p>
          </div>

          {/* Social Signup */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
               <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 mr-2" alt="Google" />
               <span className="text-sm font-semibold text-gray-700">Google</span>
            </button>
            <button className="flex items-center justify-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
               <img src="https://www.svgrepo.com/show/448224/github.svg" className="h-5 w-5 mr-2" alt="GitHub" />
               <span className="text-sm font-semibold text-gray-700">GitHub</span>
            </button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or register with email</span></div>
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r animate-pulse">
              <div className="flex">
                <span className="text-red-500 mr-2">⚠️</span>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleRegister}>
            
            {/* Email */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">📧</div>
                   <input
                    type="email" required
                    className="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 transition"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Create Password</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">🔒</div>
                   <input
                    type="password" required
                    className="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 transition"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">🔐</div>
                   <input
                    type="password" required
                    className={`w-full pl-10 px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 transition ${confirmPass && password !== confirmPass ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
                    placeholder="Repeat password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                  />
                </div>
                {confirmPass && password !== confirmPass && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white ${
                    loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all'
                }`}
            >
                {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-500 transition">
              Log in here
            </Link>
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: BENEFITS & IMAGE --- */}
      <div className="hidden md:flex md:w-1/2 bg-gray-900 relative overflow-hidden">
         <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            alt="Register Background"
         />
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-900/90 to-purple-900/80"></div>

         <div className="relative z-10 flex flex-col justify-center px-12 h-full text-white space-y-8">
            <h2 className="text-3xl font-bold leading-tight">Why join EduStream?</h2>
            
            <ul className="space-y-6">
                <FeatureItem icon="🎥" title="Unlimited Access" desc="Watch premium courses on Python, Web Dev & more." />
                <FeatureItem icon="🤖" title="AI Personal Tutor" desc="Get instant help with code & concepts 24/7." />
                <FeatureItem icon="🏆" title="Earn Certificates" desc="Get recognized certificates upon course completion." />
                <FeatureItem icon="🔴" title="Live Interactive Classes" desc="Join live doubt sessions with expert instructors." />
            </ul>
         </div>
      </div>

    </div>
  );
}

// Sub-component for Feature List
function FeatureItem({ icon, title, desc }: any) {
    return (
        <div className="flex items-start gap-4">
            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm text-2xl">{icon}</div>
            <div>
                <h4 className="font-bold text-lg">{title}</h4>
                <p className="text-indigo-200 text-sm">{desc}</p>
            </div>
        </div>
    )
}