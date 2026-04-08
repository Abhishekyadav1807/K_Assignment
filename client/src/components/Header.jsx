import { useAuth } from "../context/AuthContext.jsx";

export const Header = ({ onAddApplication }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-ink/10 bg-mist/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-pine">Job Tracker</p>
          <h1 className="font-display text-2xl font-semibold text-ink">Application Pipeline</h1>
        </div>

        <div className="flex items-center gap-3">
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
