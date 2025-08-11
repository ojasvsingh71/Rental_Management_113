import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 md:p-8 rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex justify-between mb-6">
          <h1 className="text-lg md:text-xl font-semibold text-white tracking-wide">
            Rental Management
          </h1>
          <button 
            onClick={() => navigate("/")}
            className="px-3 md:px-4 py-1 rounded-full text-xs md:text-sm border border-white/30 hover:bg-white/20 transition"
          >
            Home
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400 outline-none"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400 outline-none pr-10"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-2 text-gray-400 disabled:opacity-50"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Signing In..." : "SIGN IN"}
          </button>

          <p className="text-sm mt-4 text-gray-400">
            don’t have account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-400 cursor-pointer hover:underline"
            >
              Register here
            </span>
          </p>
          <p className="text-sm text-gray-500 cursor-pointer hover:underline text-center">
            forgot username / password
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;