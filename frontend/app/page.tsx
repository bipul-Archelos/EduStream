"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    const endpoint = isRegistering ? "/register" : "/login";
    
    // Backend API Call
    try {
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.status);
        if (!isRegistering) {
          // Login Success hua to Dashboard par bhejo
          localStorage.setItem("userRole", data.role);
          router.push("/dashboard");
        } else {
          setIsRegistering(false); // Register ke baad Login karne bolo
        }
      } else {
        alert("Error: " + data.detail);
      }
    } catch (error) {
      alert("Backend se connect nahi ho raha!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
          {isRegistering ? "Join EduStream" : "Welcome Back"}
        </h1>

        <input className="w-full p-3 mb-4 bg-gray-700 rounded text-white" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full p-3 mb-4 bg-gray-700 rounded text-white" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

        {isRegistering && (
          <select className="w-full p-3 mb-4 bg-gray-700 rounded text-white" onChange={(e) => setRole(e.target.value)}>
            <option value="student">I am a Student</option>
            <option value="trainer">I am a Trainer</option>
          </select>
        )}

        <button onClick={handleAuth} className="w-full bg-blue-600 p-3 rounded font-bold hover:bg-blue-500 transition">
          {isRegistering ? "Sign Up" : "Login"} 
        </button>

        <p className="mt-4 text-center text-gray-400 cursor-pointer hover:text-white" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Already have an account? Login" : "New here? Create Account"}
        </p>
      </div>
    </div>
  );
}