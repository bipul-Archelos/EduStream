"use client";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        formData
      );

      Cookies.set("token", res.data.access_token);
      router.push("/dashboard");

    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* --- LEFT SIDE: LOGIN FORM --- */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 animate-fade-in-up">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header */}
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Welcome back to <span className="text-indigo-600">EduStream</span>
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              New here?{' '}
              <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition">
                Create an account for free
              </Link>
            </p>
          </div>

          {/* Social Login (Visual Only for now) */}
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

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-500">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              
              {/* Email Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">📧</span>
                   </div>
                   <input
                    type="email"
                    required
                    className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">🔒</span>
                   </div>
                   <input
                    type="password"
                    required
                    className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white ${
                    loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all'
                }`}
              >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                    </span>
                ) : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- RIGHT SIDE: IMAGE & TESTIMONIAL --- */}
      <div className="hidden md:flex md:w-1/2 bg-indigo-900 relative overflow-hidden">
         {/* Background Image with Overlay */}
         <img 
            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            alt="Study"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-transparent to-transparent"></div>

         <div className="relative z-10 flex flex-col justify-end p-12 h-full text-white space-y-6">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl animate-fade-in-up">
                <div className="text-yellow-400 text-xl mb-2">★★★★★</div>
                <blockquote className="text-lg font-medium leading-relaxed">
                    "This platform completely changed the way I learn code. The AI Tutor feels like having a senior developer sitting next to me 24/7."
                </blockquote>
                <div className="mt-4 flex items-center gap-3">
                    <img className="h-10 w-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
                    <div>
                        <div className="font-bold">Rahul Sharma</div>
                        <div className="text-indigo-200 text-sm">Full Stack Developer</div>
                    </div>
                </div>
            </div>
            <p className="text-indigo-200 text-xs text-center">© 2025 EduStream Inc. All rights reserved.</p>
         </div>
      </div>

    </div>
  );
}