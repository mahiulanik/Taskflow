import { useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import API from "../api/axios";

export default function VerifyOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      const newOtp = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
      setOtp(newOtp);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }
    const email = localStorage.getItem("resetEmail");
    if (!email) {
      navigate("/forgot-password");
      return;
    }
    setLoading(true);
    try {
      await API.post("/verify-otp", { email, otp: otpString });
      localStorage.setItem("resetOtp", otpString);
      navigate("/reset-password");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: "Email" },
    { label: "Verify" },
    { label: "New Password" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 card-dyn border border-dyn rounded-lg p-2 text-sec-dyn hover:text-dyn hover:bg-hover btn-icon"
      >
        {dark ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-dyn">Verify OTP</h1>
        <p className="text-sec-dyn text-center mb-6">
          Enter the 6-digit code sent to your email
        </p>

        {/* Step Stepper */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < 2;
            const isCurrent = stepNum === 2;
            return (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                      isCurrent
                        ? "bg-purple-primary text-white"
                        : isCompleted
                        ? "bg-purple-primary text-white"
                        : "card-dyn border border-dyn text-muted-dyn"
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      stepNum
                    )}
                  </div>
                  <span
                    className={`text-xs mt-1.5 font-medium ${
                      isCurrent ? "text-purple-primary" : isCompleted ? "text-dyn" : "text-muted-dyn"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 mb-5 rounded ${
                      i < 1 ? "bg-purple-primary" : "bg-dyn border border-dyn"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="surface-dyn rounded-xl p-8 space-y-5">
          {error && (
            <div className="bg-red/10 border border-red/30 text-red text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-sec-dyn mb-1.5">OTP Code</label>
            <div className="flex justify-center gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  className="w-12 h-14 card-dyn border border-dyn rounded-lg text-center text-2xl font-semibold text-dyn placeholder:text-muted-dyn focus:border-purple-primary transition"
                  placeholder="•"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-primary hover:bg-purple-hover text-white font-semibold py-2.5 rounded-lg btn disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <p className="text-center text-sec-dyn text-sm">
            <Link to="/login" className="text-purple-light hover:underline font-medium">
              Back to Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
