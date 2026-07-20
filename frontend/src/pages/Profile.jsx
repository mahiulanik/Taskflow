import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
  });
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [profileLoading, setProfileLoading] = useState(false);

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });
  const [pwLoading, setPwLoading] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        mobile: user.mobile || "",
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: "", text: "" });
    setProfileLoading(true);
    try {
      const res = await API.put("/profile", profileForm);
      setUser(res.data);
      setProfileMsg({ type: "success", text: "Profile updated successfully" });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.response?.data?.error || "Update failed" });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwMsg({ type: "", text: "" });

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: "error", text: "Passwords do not match" });
      return;
    }

    setPwLoading(true);
    try {
      await API.put("/change-password", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwMsg({ type: "success", text: "Password changed successfully" });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwMsg({ type: "error", text: err.response?.data?.error || "Password change failed" });
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await API.delete("/account");
      logout();
      navigate("/login");
    } catch (err) {
      setProfileMsg({ type: "error", text: err.response?.data?.error || "Failed to delete account" });
      setShowDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`fixed lg:static z-40 h-full transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="surface-dyn border-b border-dyn px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-sec-dyn hover:text-dyn"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-lg lg:text-xl font-bold text-dyn">Profile</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="card-dyn border border-dyn rounded-lg p-2 text-sec-dyn hover:text-dyn hover:bg-hover btn-icon"
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
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

            <button
              onClick={() => navigate("/")}
              className="card-dyn border border-dyn rounded-lg px-3 py-2 text-sec-dyn hover:text-dyn hover:bg-hover btn text-sm font-medium flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-2xl mx-auto">
            {/* Profile Header Card */}
            <div className="surface-dyn rounded-xl border border-dyn p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-purple-primary flex items-center justify-center text-2xl font-bold text-white">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dyn">{user?.firstName} {user?.lastName}</h3>
                  <p className="text-sec-dyn text-sm">{user?.email}</p>
                  <p className="text-muted-dyn text-xs mt-0.5">{user?.mobile}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 surface-dyn rounded-xl border border-dyn p-1 mb-6">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium btn ${
                  activeTab === "profile"
                    ? "bg-purple-primary text-white"
                    : "text-sec-dyn hover:text-dyn hover:bg-hover"
                }`}
              >
                Edit Profile
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium btn ${
                  activeTab === "password"
                    ? "bg-purple-primary text-white"
                    : "text-sec-dyn hover:text-dyn hover:bg-hover"
                }`}
              >
                Change Password
              </button>
            </div>

            {/* Edit Profile */}
            {activeTab === "profile" && (
              <div className="surface-dyn rounded-xl border border-dyn p-6">
                <h3 className="text-lg font-bold text-dyn mb-5">Personal Information</h3>

                {profileMsg.text && (
                  <div className={`mb-4 text-sm rounded-lg p-3 ${
                    profileMsg.type === "success"
                      ? "bg-green/10 border border-green/30 text-green"
                      : "bg-red/10 border border-red/30 text-red"
                  }`}>
                    {profileMsg.text}
                  </div>
                )}

                <form onSubmit={handleProfileUpdate} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-sec-dyn mb-1.5">First Name</label>
                      <input
                        type="text"
                        required
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        className="w-full card-dyn border border-dyn rounded-lg px-4 py-2.5 text-dyn placeholder:text-muted-dyn focus:border-purple-primary transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-sec-dyn mb-1.5">Last Name</label>
                      <input
                        type="text"
                        required
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        className="w-full card-dyn border border-dyn rounded-lg px-4 py-2.5 text-dyn placeholder:text-muted-dyn focus:border-purple-primary transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sec-dyn mb-1.5">Mobile</label>
                    <input
                      type="tel"
                      required
                      value={profileForm.mobile}
                      onChange={(e) => setProfileForm({ ...profileForm, mobile: e.target.value })}
                      className="w-full card-dyn border border-dyn rounded-lg px-4 py-2.5 text-dyn placeholder:text-muted-dyn focus:border-purple-primary transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sec-dyn mb-1.5">Email</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ""}
                      className="w-full card-dyn border border-dyn rounded-lg px-4 py-2.5 text-muted-dyn opacity-60 cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-dyn mt-1">Email cannot be changed</p>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="bg-purple-primary hover:bg-purple-hover text-white font-semibold px-6 py-2.5 rounded-lg btn disabled:opacity-50"
                    >
                      {profileLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Change Password */}
            {activeTab === "password" && (
              <div className="surface-dyn rounded-xl border border-dyn p-6">
                <h3 className="text-lg font-bold text-dyn mb-5">Change Password</h3>

                {pwMsg.text && (
                  <div className={`mb-4 text-sm rounded-lg p-3 ${
                    pwMsg.type === "success"
                      ? "bg-green/10 border border-green/30 text-green"
                      : "bg-red/10 border border-red/30 text-red"
                  }`}>
                    {pwMsg.text}
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-sec-dyn mb-1.5">Current Password</label>
                    <input
                      type="password"
                      required
                      value={pwForm.currentPassword}
                      onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                      className="w-full card-dyn border border-dyn rounded-lg px-4 py-2.5 text-dyn placeholder:text-muted-dyn focus:border-purple-primary transition"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sec-dyn mb-1.5">New Password</label>
                    <input
                      type="password"
                      required
                      value={pwForm.newPassword}
                      onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                      className="w-full card-dyn border border-dyn rounded-lg px-4 py-2.5 text-dyn placeholder:text-muted-dyn focus:border-purple-primary transition"
                      placeholder="Min 8 characters"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sec-dyn mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={pwForm.confirmPassword}
                      onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                      className="w-full card-dyn border border-dyn rounded-lg px-4 py-2.5 text-dyn placeholder:text-muted-dyn focus:border-purple-primary transition"
                      placeholder="Repeat new password"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={pwLoading}
                      className="bg-purple-primary hover:bg-purple-hover text-white font-semibold px-6 py-2.5 rounded-lg btn disabled:opacity-50"
                    >
                      {pwLoading ? "Changing..." : "Change Password"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Danger Zone */}
            <div className="surface-dyn rounded-xl border border-red/30 p-6 mt-6">
              <h3 className="text-lg font-bold text-red mb-2">Danger Zone</h3>
              <p className="text-sec-dyn text-sm mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>

              {profileMsg.text && profileMsg.type === "error" && (
                <div className="mb-4 text-sm rounded-lg p-3 bg-red/10 border border-red/30 text-red">
                  {profileMsg.text}
                </div>
              )}

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red/10 hover:bg-red/20 border border-red/30 text-red font-semibold px-6 py-2.5 rounded-lg btn"
                >
                  Delete Account
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="bg-red hover:bg-red/80 text-white font-semibold px-6 py-2.5 rounded-lg btn disabled:opacity-50"
                  >
                    {deleteLoading ? "Deleting..." : "Yes, Delete My Account"}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="card-dyn border border-dyn text-sec-dyn hover:text-dyn hover:bg-hover font-semibold px-6 py-2.5 rounded-lg btn"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
