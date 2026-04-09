import { useAuth } from "../context/AuthContext.jsx";

export const Header = ({ onAddApplication }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-ink/10 bg-mist/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-pine">Job Tracker</p>
          <h1 className="font-display text-xl font-semibold text-ink sm:text-2xl">Application Pipeline</h1>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end sm:gap-3">
          <div className="hidden rounded-2xl border border-ink/10 bg-white px-4 py-2 text-sm text-ink/70 sm:block">
            {user?.email}
          </div>
          <button
            className="rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90"
            onClick={onAddApplication}
          >
            Add Application
          </button>
          <button
            className="rounded-2xl border border-ink/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-ink/20"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
