export default function TaskCard({ task, onClick, onEdit, onDelete }) {
  const statusColors = {
    "In Progress": "bg-blue",
    Completed: "bg-green",
    Cancelled: "bg-red",
  };

  return (
    <div
      onClick={() => onClick(task)}
      className="card-dyn hover:bg-hover border border-dyn rounded-lg p-4 cursor-pointer group pressable flex flex-col"
    >
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-sm leading-snug text-dyn line-clamp-2">{task.title}</h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="text-muted-dyn hover:text-purple-light btn-icon rounded p-0.5"
            title="Edit task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task._id);
            }}
            className="text-muted-dyn hover:text-red btn-icon rounded p-0.5"
            title="Delete task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <p className="text-sec-dyn text-xs leading-relaxed line-clamp-2 mb-3">
        {task.description}
      </p>
      </div>
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-dyn">
        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColors[task.status]} bg-opacity-20 text-white`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusColors[task.status]}`}></span>
          {task.status}
        </span>
        <span className="text-[11px] text-muted-dyn">
          {new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>
    </div>
  );
}
