import { useMemo, useState } from "react";
import { ApplicationModal } from "../components/ApplicationModal.jsx";
import { Header } from "../components/Header.jsx";
import { KanbanColumn } from "../components/KanbanColumn.jsx";
import { useApplications, useUpdateStatus } from "../hooks/useApplications.js";
import { statuses } from "../types/index.js";

export const DashboardPage = () => {
  const { data, isLoading, error } = useApplications();
  const updateStatusMutation = useUpdateStatus();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const groupedApplications = useMemo(
    () =>
      statuses.reduce((accumulator, status) => {
        accumulator[status] = (data ?? []).filter((application) => application.status === status);
        return accumulator;
      }, {}),
    [data]
  );

  const openNewModal = () => {
    setSelectedApplication(null);
    setModalOpen(true);
  };

  const openExistingModal = (application) => {
    setSelectedApplication(application);
    setModalOpen(true);
  };

  const handleDropCard = async (status, applicationId) => {
    const application = data?.find((item) => item._id === applicationId);

    if (!application || application.status === status) {
      return;
    }

    await updateStatusMutation.mutateAsync({ id: applicationId, status });
  };

  return (
    <div className="min-h-screen bg-mist text-ink">
      <Header onAddApplication={openNewModal} />
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        <section className="mb-8 rounded-[32px] border border-ink/10 bg-[linear-gradient(135deg,_rgba(216,100,60,0.10),_rgba(46,95,81,0.08))] p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-pine">Dashboard</p>
              <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl md:text-4xl">
                Track your applications from first submission to final outcome.
              </h2>
              <p className="mt-3 text-base leading-7 text-ink/70">
                Add a role, paste the job description if needed, and move each application through the hiring stages
                as things progress.
              </p>
            </div>
            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:w-auto">
              {statuses.map((status) => (
                <div key={status} className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3">
                  <p className="text-sm text-ink/60">{status}</p>
                  <p className="mt-1 text-2xl font-semibold text-ink">{groupedApplications[status]?.length ?? 0}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="rounded-[28px] border border-ink/10 bg-white p-10 text-center text-ink/65 shadow-card">
            Loading your applications...
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-10 text-center text-red-700 shadow-card">
            Something went wrong while loading applications. Please refresh and try again.
          </div>
        ) : !data?.length ? (
          <div className="rounded-[28px] border border-dashed border-ink/15 bg-white p-12 text-center shadow-card">
            <h3 className="font-display text-2xl font-semibold text-ink">Your board is empty</h3>
            <p className="mx-auto mt-3 max-w-xl text-ink/65">
              Start by adding your first application. It will appear in the Applied column and can be updated later.
            </p>
            <button
              className="mt-6 rounded-2xl bg-accent px-5 py-3 font-semibold text-white transition hover:bg-accent/90"
              onClick={openNewModal}
            >
              Add Your First Application
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto pb-2">
            <div className="grid min-w-[1180px] gap-5 xl:min-w-0 xl:grid-cols-5">
              {statuses.map((status) => (
                <KanbanColumn
                  key={status}
                  title={status}
                  applications={groupedApplications[status]}
                  onDropCard={handleDropCard}
                  onOpenCard={openExistingModal}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <ApplicationModal
        application={selectedApplication}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};
