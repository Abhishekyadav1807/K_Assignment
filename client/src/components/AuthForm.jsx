import { useState } from "react";

export const AuthForm = ({ onSubmit, submitLabel, errorMessage, isLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit({ email, password });
      }}
    >
      <label className="block space-y-2">
        <span className="text-sm font-medium text-ink/80">Email</span>
        <input
          className="w-full rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none transition focus:border-pine"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-ink/80">Password</span>
        <input
          className="w-full rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none transition focus:border-pine"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimum 6 characters"
          minLength={6}
          required
        />
      </label>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <button
        className="w-full rounded-2xl bg-ink px-4 py-3 font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Please wait..." : submitLabel}
      </button>
    </form>
  );
};
