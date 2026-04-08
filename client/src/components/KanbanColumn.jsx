import { cn } from "../lib/cn.js";
import { ApplicationCard } from "./ApplicationCard.jsx";

const accents = {
  Applied: "from-[#f3dfb7] to-[#f7efe0]",
  "Phone Screen": "from-[#d8ebed] to-[#eef8f8]",
  Interview: "from-[#e8dfef] to-[#f4eef8]",
  Offer: "from-[#d7ead8] to-[#eef7ef]",
  Rejected: "from-[#f2d7d7] to-[#faeeee]"
};

export const KanbanColumn = ({ title, applications, onDropCard, onOpenCard }) => (
  <section
    onDragOver={(event) => event.preventDefault()}
    onDrop={(event) => {
      const applicationId = event.dataTransfer.getData("applicationId");
      if (applicationId) {
        onDropCard(title, applicationId);
      }
    }}
    className={cn(
      "flex min-h-[480px] flex-col rounded-[28px] border border-ink/10 bg-gradient-to-b p-4",
      accents[title]
    )}
  >
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
        <p className="text-sm text-ink/60">{applications.length} applications</p>
      </div>
    </div>
    <div className="flex flex-1 flex-col gap-3">
      {applications.length ? (
        applications.map((application) => (
          <ApplicationCard key={application._id} application={application} onOpen={onOpenCard} />
        ))
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-3xl border border-dashed border-ink/15 bg-white/55 p-6 text-center text-sm text-ink/55">
          Drop a card here when the application moves to this stage.
        </div>
      )}
    </div>
  </section>
);
