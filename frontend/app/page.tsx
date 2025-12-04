"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// API Response ka Type define kiya (TypeScript Best Practice)
interface AuthResponse {
  status: string;
  role?: string;
  token?: string;
  detail?: string;
}

export default function LoginPage() {
  // State variables with Types
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("student");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  
  const router = useRouter();

  const handleAuth = async () => {
    // 1. Validation
    if (!email || !password) {
      setErrorMsg("Please fill all fields");
      return;
    }

    setLoading(true);
    setErrorMsg(""); // Clear previous errors

    const endpoint = isRegistering ? "/register" : "/login";
    
    try {
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      // Type Assertion (TS ko bata rahe hain ki response kaisa hoga)
      const data: AuthResponse = await res.json();

      if (res.ok) {
        alert(data.status);
        if (!isRegistering) {
          // Login Success
          if (data.role) {
            localStorage.setItem("userRole", data.role);
            console.log("Redirecting to dashboard...");
            router.push("/dashboard");
          }
        } else {
          // Registration Success -> Switch to Login
          setIsRegistering(false);
        }
      } else {
        setErrorMsg(data.detail || "Something went wrong");
      }
    } catch (error) {
      console.error("Connection Error:", error);
      setErrorMsg("Backend disconnected. Is Docker running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
          {isRegistering ? "Join EduStream" : "Welcome Back"}
        </h1>

        {/* Error Box */}
        {errorMsg && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <div className="space-y-4">
          <input 
            className="w-full p-3 bg-gray-700 rounded text-white outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Email" 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            className="w-full p-3 bg-gray-700 rounded text-white outline-none focus:ring-2 focus:ring-blue-500" 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />

          {isRegistering && (
            <select 
              className="w-full p-3 bg-gray-700 rounded text-white outline-none focus:ring-2 focus:ring-blue-500" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">I am a Student</option>
              <option value="trainer">I am a Trainer</option>
            </select>
          )}

          <button 
            onClick={handleAuth} 
            disabled={loading}
            className={`w-full p-3 rounded font-bold transition ${loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-500'}`}
          >
            {loading ? "Processing..." : (isRegistering ? "Sign Up" : "Login")}
          </button>
        </div>

        <p className="mt-6 text-center text-gray-400 text-sm cursor-pointer hover:text-white" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Already have an account? Login" : "New here? Create Account"}
        </p>
      </div>
    </div>
  );
}