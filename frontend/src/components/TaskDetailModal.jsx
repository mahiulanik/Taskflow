const statusColors = {
  "In Progress": "bg-blue",
  Completed: "bg-green",
  Cancelled: "bg-red",
};

export default function TaskDetailModal({ task, onClose, onEdit }) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="surface-dyn rounded-xl w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-dyn">
          <h2 className="text-lg font-bold text-dyn">Task Details</h2>
          <button onClick={onClose} className="text-muted-dyn hover:text-dyn btn-icon">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-sec-dyn mb-1.5">Title</label>
            <p className="text-dyn">{task.title}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-sec-dyn mb-1.5">Description</label>
            <p className="text-dyn whitespace-pre-wrap">{task.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-sec-dyn mb-1.5">Status</label>
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[task.status]} bg-opacity-20 text-white`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusColors[task.status]}`}></span>
                {task.status}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-sec-dyn mb-1.5">Created</label>
              <p className="text-dyn text-sm">
                {new Date(task.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 card-dyn hover:bg-hover border border-dyn text-sec-dyn font-medium py-2.5 rounded-lg btn"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              className="flex-1 bg-purple-primary hover:bg-purple-hover text-white font-semibold py-2.5 rounded-lg btn"
            >
              Edit Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
