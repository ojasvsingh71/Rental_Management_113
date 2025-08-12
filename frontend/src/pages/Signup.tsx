import React, { useState,useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import * as THREE from "three";

const API_BASE = "/api/auth";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [info, setInfo] = useState("");

  const vantaRef = useRef<HTMLDivElement | null>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    const loadVanta = async () => {
      const VANTA = await import("vanta/dist/vanta.net.min");

      if (isMounted && !vantaEffect.current) {
        vantaEffect.current = VANTA.default({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: true,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xfff5,
          backgroundColor: 0x0,
          points: 20.0,
          maxDistance: 10.0,
          spacing: 20.0,
        });
      }
    };

    loadVanta();

    return () => {
      isMounted = false;
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);
  // Check if user/admin exists
  const checkUserOrAdmin = async () => {
    setError("");
    setInfo("");
    if (!form.email) {
      setError("Please enter your email");
      return false;
    }
    try {
      // Check user existence
      const res = await fetch(
        `${API_BASE}/check-user?email=${encodeURIComponent(form.email)}`
      );
      const data = await res.json();
      if (data.exists) {
        setError("User already exists. Please login.");
        return false;
      }
      // If admin, check admin existence
      if (form.role === "ADMIN") {
        const res2 = await fetch(`${API_BASE}/check-admin`);
        const data2 = await res2.json();
        if (data2.adminExists) {
          setError("Admin already exists. Please login as admin.");
          return false;
        }
      }
      return true;
    } catch (e) {
      setError("Network error. Please try again.");
      return false;
    }
  };

  // Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    const ok = await checkUserOrAdmin();
    if (!ok) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/generate-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setOtpSent(true);
      setStep(2);
      setInfo(
        "OTP sent to your email. Please check your inbox (and spam folder)."
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const res = await fetch(`${API_BASE}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, code: otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");
      setOtpVerified(true);
      setStep(3);
      setInfo("OTP verified! You can now complete your registration.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!form.email || !form.name || !form.password) {
      setError("Please fill in all required fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    setLoading(true);
    try {
      await signup({
        email: form.email,
        name: form.name,
        phone: form.phone,
        password: form.password,
        role: form.role,
      });
      navigate("/dashboard");
    } catch (err: any) {
      // Show backend error (e.g. please verify OTP)
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const passwordStrength = () => {
    if (form.password.length >= 8)
      return { label: "Strong", color: "bg-green-500", width: "w-full" };
    if (form.password.length >= 4)
      return { label: "Medium", color: "bg-yellow-500", width: "w-2/3" };
    if (form.password.length > 0)
      return { label: "Weak", color: "bg-red-500", width: "w-1/3" };
    return { label: "", color: "", width: "w-0" };
  };

  const strength = passwordStrength();

  return (
    <div
      ref={vantaRef}
      className="flex justify-center items-center min-h-screen relative"
    >
      <div className=" backdrop-blur-lg border border-white/20 p-6 md:p-8 rounded-2xl w-full max-w-md shadow-xl relative z-10">
        <div className=" backdrop-blur-lg border border-white/20 p-6 md:p-8 rounded-2xl w-full max-w-md shadow-xl">
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

          {/* Stepper UI */}
          <div className="flex items-center justify-center mb-6 gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                step >= 1 ? "bg-blue-400" : "bg-gray-500"
              }`}
            ></div>
            <div
              className={`h-2 w-2 rounded-full ${
                step >= 2 ? "bg-blue-400" : "bg-gray-500"
              }`}
            ></div>
            <div
              className={`h-2 w-2 rounded-full ${
                step >= 3 ? "bg-blue-400" : "bg-gray-500"
              }`}
            ></div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-sm mb-2">
              {error}
            </div>
          )}
          {info && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-2 rounded-lg text-sm mb-2">
              {info}
            </div>
          )}

          {/* Step 1: Email & Role, Send OTP */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400 outline-none"
                  disabled={loading}
                >
                  <option value="ADMIN" className="text-black">
                    Admin
                  </option>
                  <option value="CUSTOMER" className="text-black">
                    Customer
                  </option>
                  <option value="END_USER" className="text-black">
                    End User
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400 outline-none"
                  disabled={loading}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
              <p className="text-sm mt-4 text-gray-400">
                already have account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-blue-400 cursor-pointer hover:underline"
                >
                  Login
                </span>
              </p>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Enter OTP sent to your email
                </label>
                <input
                  type="text"
                  name="otp"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400 outline-none"
                  disabled={loading}
                  maxLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setOtpSent(false);
                  setError("");
                  setInfo("");
                }}
                className="w-full py-2 rounded-full bg-gray-700 text-white font-semibold shadow-md hover:scale-105 transition-transform mt-2"
                disabled={loading}
              >
                Back
              </button>
            </form>
          )}

          {/* Step 3: Registration Form */}
          {step === 3 && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400 outline-none"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Your Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="e.g. 9099898090"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400 outline-none"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400 outline-none pr-10"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {strength.label && (
                  <div className="mt-2">
                    <div className="h-1 rounded-full bg-white/20 overflow-hidden">
                      <div
                        className={`${strength.color} ${strength.width} h-1 transition-all`}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-300 mt-1">
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400 outline-none"
                  disabled={loading}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Creating Account..." : "SIGN UP"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
