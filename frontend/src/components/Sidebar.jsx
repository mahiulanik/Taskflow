import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isProfile = location.pathname === "/profile";

  return (
    <div className="w-64 surface-dyn h-full flex flex-col border-r border-dyn">
      <div className="p-6 border-b border-dyn">
        <h1 className="text-xl font-bold flex items-center gap-2 text-dyn">
          <span className="text-purple-primary text-2xl">&#9776;</span>
          Taskflow
        </h1>
      </div>

      <div className="flex-1 p-4">
        <p className="text-xs font-semibold text-muted-dyn tracking-wider uppercase mb-3 px-2">
          Boards
        </p>
        <div className="space-y-1">
          <button
            onClick={() => { navigate("/"); onClose?.(); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 btn ${
              !isProfile
                ? "bg-purple-primary/20 text-purple-light"
                : "text-sec-dyn hover:text-dyn hover:bg-hover/50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            My Tasks
          </button>
          <button
            onClick={() => { navigate("/profile"); onClose?.(); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 btn ${
              isProfile
                ? "bg-purple-primary/20 text-purple-light"
                : "text-sec-dyn hover:text-dyn hover:bg-hover/50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-dyn">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-purple-primary flex items-center justify-center text-sm font-bold text-white">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-dyn">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-muted-dyn truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-left text-sm text-sec-dyn hover:text-red px-2 py-1.5 rounded btn"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
