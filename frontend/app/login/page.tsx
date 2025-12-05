"use client";
import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight } from 'lucide-react';

interface AuthResponse {
  status: string;
  role?: string;
  token?: string;
  detail?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg("Please fill all fields");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await res.json();

      if (res.ok) {
        if (data.role) localStorage.setItem("userRole", data.role);
        if (data.token) localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        setErrorMsg(data.detail || "Login failed");
      }
    } catch (error: unknown) {
      console.error(error);
      setErrorMsg("Connection failed. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
        <h1 className="text-3xl font-bold text-blue-400 text-center mb-6">Welcome Back</h1>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
            <input 
              className="w-full pl-10 p-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white outline-none focus:border-blue-500" 
              placeholder="Email address" 
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
            <input 
              className="w-full pl-10 p-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white outline-none focus:border-blue-500" 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
            />
          </div>

          <button 
            onClick={handleLogin} 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-lg flex items-center justify-center gap-2"
          >
            {loading ? "Logging in..." : "Login"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>

        <p className="mt-8 text-center text-slate-400 text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}