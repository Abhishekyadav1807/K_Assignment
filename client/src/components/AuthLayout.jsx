import { Link } from "react-router-dom";

export const AuthLayout = ({
  title,
  subtitle,
  footerLabel,
  footerLink,
  footerText,
  children
}) => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(200,162,92,0.18),_transparent_30%),linear-gradient(135deg,_#f6f0e6_0%,_#eef3ed_52%,_#f7f4ee_100%)] px-4 py-8 text-ink">
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
      <div className="space-y-8">
        <div className="inline-flex items-center gap-3 rounded-full border border-ink/10 bg-white/75 px-4 py-2 text-sm font-semibold text-pine shadow-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          Job Application Tracker
        </div>
        <div className="space-y-3">
          <h1 className="max-w-xl font-display text-4xl font-semibold leading-tight md:text-5xl">
            Track every application in one place.
          </h1>
          <p className="max-w-xl text-base leading-7 text-ink/75 md:text-lg">{subtitle}</p>
        </div>
        <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-card backdrop-blur">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-ink/55">Applications</p>
              <p className="mt-1 text-lg font-semibold text-ink">Centralized tracking</p>
            </div>
            <div>
              <p className="text-sm text-ink/55">Workflow</p>
              <p className="mt-1 text-lg font-semibold text-ink">Simple Kanban stages</p>
            </div>
            <div>
                    <p className="text-sm text-ink/55">Smart Assist</p>
                    <p className="mt-1 text-lg font-semibold text-ink">JD parsing and bullet ideas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-white/75 bg-white/92 p-8 shadow-card backdrop-blur">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pine">Account</p>
          <h2 className="mt-2 font-display text-3xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-ink/65">{footerText}</p>
        </div>
        {children}
        <p className="mt-6 text-sm text-ink/70">
          {footerLabel}{" "}
          <Link className="font-semibold text-accent transition hover:text-accent/80" to={footerLink}>
            {title === "Login" ? "Create an account" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  </div>
);
