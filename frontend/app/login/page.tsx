"use client";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend expects FormData for OAuth2
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        formData
      );

      // Save Token
      Cookies.set("token", res.data.access_token);
      
      alert("Login Successful! 🚀");
      router.push("/dashboard");

    } catch (error: any) {
      console.error(error);
      alert("Login Failed: Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Student Login</h1>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" 
              type="email"
              required
              placeholder="admin@test.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" 
              type="password" 
              required
              placeholder="********" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button 
            disabled={loading}
            className={`text-white p-2 rounded transition ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}