import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      await register(data);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

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
        <h1 className="text-3xl font-bold text-center mb-2 text-dyn">Create Account</h1>
        <p className="text-sec-dyn text-center mb-8">
          Get started with Task Manager
        </p>

        <form onSubmit={handleSubmit} className="surface-dyn rounded-xl p-8 space-y-5">
          {error && (
            <div className="bg-red/10 border border-red/30 text-red text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-sec-dyn mb-1.5">First Name</label>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={update("firstName")}
                className="w-full card-dyn border border-dyn rounded-lg px-4 py-2.5 text-dyn placeholder:text-muted-dyn focus:border-purple-primary transition"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sec-dyn mb-1.5">Last Name</label>
              <input
                type="text"
                required
                value={form.lastName}
                onChange={update("lastName")}
                className="w-full card-dyn border border-dyn rounded-lg px-4 py-2.5 text-dyn placeholder:text-muted-dyn focus:border-purple-primary transition"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-sec-dyn mb-1.5">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={update("email")}
              className="w-full card-dyn border border-dyn rounded-lg px-4 py-2.5 text-dyn placeholder:text-muted-dyn focus:border-purple-primary transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sec-dyn mb-1.5">Mobile</label>
            <input
              type="tel"
              required
              value={form.mobile}
              onChange={update("mobile")}
              className="w-full card-dyn border border-dyn rounded-lg px-4 py-2.5 text-dyn placeholder:text-muted-dyn focus:border-purple-primary transition"
              placeholder="+1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sec-dyn mb-1.5">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={update("password")}
              className="w-full card-dyn border border-dyn rounded-lg px-4 py-2.5 text-dyn placeholder:text-muted-dyn focus:border-purple-primary transition"
              placeholder="Min 8 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sec-dyn mb-1.5">Confirm Password</label>
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={update("confirmPassword")}
              className="w-full card-dyn border border-dyn rounded-lg px-4 py-2.5 text-dyn placeholder:text-muted-dyn focus:border-purple-primary transition"
              placeholder="Repeat password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-primary hover:bg-purple-hover text-white font-semibold py-2.5 rounded-lg btn disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="text-center text-sec-dyn text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-light hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
