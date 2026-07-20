import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Theme toggle */}
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
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-purple-primary flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <span className="text-xl font-bold text-dyn">Taskflow</span>
        </div>

        <h1 className="text-2xl font-bold text-center mb-1 text-dyn">Welcome back</h1>
        <p className="text-sec-dyn text-center mb-8 text-sm">
          Sign in to continue to your tasks
        </p>

        <form onSubmit={handleSubmit} className="surface-dyn rounded-2xl p-8 shadow-lg border border-dyn/50">
          {error && (
            <div className="bg-red/10 border border-red/30 text-red text-sm rounded-xl p-3 mb-5">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              {/* <label className="block text-xs font-semibold text-sec-dyn mb-2 uppercase tracking-wider">Email</label> */}
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full card-dyn border border-dyn rounded-xl px-4 py-3 text-sm text-dyn placeholder:text-muted-dyn focus:border-purple-primary focus:ring-1 focus:ring-purple-primary/30 transition"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              {/* <label className="block text-xs font-semibold text-sec-dyn mb-2 uppercase tracking-wider">Password</label> */}
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full card-dyn border border-dyn rounded-xl px-4 py-3 text-sm text-dyn placeholder:text-muted-dyn focus:border-purple-primary focus:ring-1 focus:ring-purple-primary/30 transition"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 mb-6">
            <label className="flex items-center gap-2 text-sm text-sec-dyn cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-dyn accent-purple-primary" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-purple-light text-sm hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-primary hover:bg-purple-hover text-white font-semibold py-3 rounded-xl btn disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dyn"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 surface-dyn text-muted-dyn">or</span>
            </div>
          </div>

          <p className="text-center text-sec-dyn text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-purple-light hover:underline font-semibold">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
