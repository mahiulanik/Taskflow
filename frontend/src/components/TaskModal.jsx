import { useState, useEffect } from "react";

const STATUSES = ["In Progress", "Completed", "Cancelled"];

export default function TaskModal({ task, onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "In Progress",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        status: task.status,
      });
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="surface-dyn rounded-xl w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-dyn">
          <h2 className="text-lg font-bold text-dyn">{task ? "Edit Task" : "Add New Task"}</h2>
          <button onClick={onClose} className="text-muted-dyn hover:text-dyn btn-icon">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-sec-dyn mb-1.5">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full card-dyn border border-dyn rounded-lg px-4 py-2.5 text-dyn placeholder:text-muted-dyn focus:border-purple-primary transition"
              placeholder="e.g. Take coffee break"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sec-dyn mb-1.5">Description</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full card-dyn border border-dyn rounded-lg px-4 py-2.5 text-dyn placeholder:text-muted-dyn focus:border-purple-primary transition resize-none"
              placeholder="e.g. It's always good to take a break."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sec-dyn mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full card-dyn border border-dyn rounded-lg px-4 py-2.5 text-dyn focus:border-purple-primary transition appearance-none cursor-pointer"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 card-dyn hover:bg-hover border border-dyn text-sec-dyn font-medium py-2.5 rounded-lg btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-primary hover:bg-purple-hover text-white font-semibold py-2.5 rounded-lg btn disabled:opacity-50"
            >
              {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
