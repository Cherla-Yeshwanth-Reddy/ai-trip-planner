import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    try {
      await api.post("/auth/register", { username, password });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch {
      alert("Username already taken or password too short.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-6">
      
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-10">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Join Us 🚀</h1>
          <p className="text-slate-500">Start planning your dream trips today</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Choose Username</label>
            <input
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
              placeholder="e.g. adventure_king"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Choose Password</label>
            <input
              type="password"
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
              placeholder="Min. 6 characters"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={submit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            Create Account
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 font-bold cursor-pointer hover:underline"
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}