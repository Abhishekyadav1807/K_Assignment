export const ApplicationCard = ({ application, onOpen }) => (
  <button
    type="button"
    draggable
    onDragStart={(event) => event.dataTransfer.setData("applicationId", application._id)}
    onClick={() => onOpen(application)}
    className="w-full rounded-3xl border border-ink/10 bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:border-pine/30"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-ink">{application.company}</p>
        <h3 className="mt-1 break-words text-lg font-semibold leading-7 text-ink/90">{application.role}</h3>
      </div>
      <span className="shrink-0 whitespace-nowrap rounded-full bg-pine/10 px-3 py-1 text-xs font-semibold text-pine">
        {application.status}
      </span>
    </div>
    <div className="mt-4 flex items-center justify-between gap-2 text-sm text-ink/60">
      <span className="min-w-0 truncate">{application.location || "Location not added"}</span>
      <span className="shrink-0">{new Date(application.dateApplied).toLocaleDateString()}</span>
    </div>
  </button>
);
