import { useEffect, useMemo, useState } from "react";
import {
  useCreateApplication,
  useDeleteApplication,
  useParseJobDescription,
  useUpdateApplication
} from "../hooks/useApplications.js";
import { cn } from "../lib/cn.js";
import { getErrorMessage } from "../lib/errors.js";
import { statuses } from "../types/index.js";
import { SuggestionPill } from "./SuggestionPill.jsx";

const createEmptyPayload = () => ({
  company: "",
  role: "",
  jdText: "",
  jdLink: "",
  notes: "",
  dateApplied: new Date().toISOString().slice(0, 10),
  status: "Applied",
  salaryRange: "",
  location: "",
  seniority: "",
  requiredSkills: [],
  niceToHaveSkills: [],
  resumeSuggestions: []
});

const parseSkills = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const ApplicationModal = ({ application, isOpen, onClose }) => {
  const [form, setForm] = useState(createEmptyPayload());
  const [errorMessage, setErrorMessage] = useState("");

  const createMutation = useCreateApplication();
  const updateMutation = useUpdateApplication();
  const deleteMutation = useDeleteApplication();
  const parseMutation = useParseJobDescription();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (application) {
      setForm({
        company: application.company,
        role: application.role,
        jdText: application.jdText,
        jdLink: application.jdLink,
        notes: application.notes,
        dateApplied: application.dateApplied.slice(0, 10),
        status: application.status,
        salaryRange: application.salaryRange,
        location: application.location,
        seniority: application.seniority,
        requiredSkills: application.requiredSkills,
        niceToHaveSkills: application.niceToHaveSkills,
        resumeSuggestions: application.resumeSuggestions
      });
    } else {
      setForm(createEmptyPayload());
    }

    setErrorMessage("");
  }, [application, isOpen]);

  const isSaving =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || parseMutation.isPending;

  const heading = useMemo(() => (application ? "Application Details" : "Add Application"), [application]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async () => {
    setErrorMessage("");

    try {
      if (application) {
        await updateMutation.mutateAsync({ id: application._id, payload: form });
      } else {
        await createMutation.mutateAsync(form);
      }

      onClose();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to save application"));
    }
  };

  const handleDelete = async () => {
    if (!application) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(application._id);
      onClose();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to delete application"));
    }
  };

  const handleParse = async () => {
    setErrorMessage("");

    try {
      const parsed = await parseMutation.mutateAsync(form.jdText);
      setForm((current) => ({
        ...current,
        company: parsed.company || current.company,
        role: parsed.role || current.role,
        location: parsed.location,
        seniority: parsed.seniority,
        requiredSkills: parsed.requiredSkills,
        niceToHaveSkills: parsed.niceToHaveSkills,
        resumeSuggestions: parsed.resumeSuggestions
      }));
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Could not parse the job description. Please try again."));
    }
  };

  const handleCopySuggestion = async (text) => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-30 flex items-start justify-center overflow-y-auto bg-ink/45 px-3 py-4 sm:px-4 sm:py-8">
      <div className="w-full max-w-4xl rounded-[26px] bg-white p-4 shadow-card sm:rounded-[30px] sm:p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-pine">Application</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">{heading}</h2>
          </div>
          <button
            className="rounded-full border border-ink/10 px-3 py-2 text-sm font-medium text-ink/70"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="mt-5 grid max-h-[68vh] gap-5 overflow-y-auto pr-1 sm:max-h-[70vh] lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-ink/10 bg-mist/60 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-ink">Job Description</h3>
                <button
                  className="rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  onClick={handleParse}
                  type="button"
                  disabled={parseMutation.isPending || form.jdText.trim().length < 30}
                >
                  {parseMutation.isPending ? "Parsing..." : "Parse"}
                </button>
              </div>
              <textarea
                className="min-h-40 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:border-pine sm:min-h-48"
                value={form.jdText}
                onChange={(event) => setForm((current) => ({ ...current, jdText: event.target.value }))}
                placeholder="Paste the job description here to fill the fields and generate resume suggestions."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-ink/80">Company</span>
                <input
                  className="w-full rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none focus:border-pine"
                  value={form.company}
                  onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-ink/80">Role</span>
                <input
                  className="w-full rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none focus:border-pine"
                  value={form.role}
                  onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-ink/80">Date Applied</span>
                <input
                  className="w-full rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none focus:border-pine"
                  type="date"
                  value={form.dateApplied}
                  onChange={(event) => setForm((current) => ({ ...current, dateApplied: event.target.value }))}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-ink/80">Status</span>
                <select
                  className="w-full rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none focus:border-pine"
                  value={form.status}
                  onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-ink/80">Location</span>
                <input
                  className="w-full rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none focus:border-pine"
                  value={form.location}
                  onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-ink/80">Seniority</span>
                <input
                  className="w-full rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none focus:border-pine"
                  value={form.seniority}
                  onChange={(event) => setForm((current) => ({ ...current, seniority: event.target.value }))}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-ink/80">JD Link</span>
                <input
                  className="w-full rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none focus:border-pine"
                  value={form.jdLink}
                  onChange={(event) => setForm((current) => ({ ...current, jdLink: event.target.value }))}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-ink/80">Salary Range</span>
                <input
                  className="w-full rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none focus:border-pine"
                  value={form.salaryRange}
                  onChange={(event) => setForm((current) => ({ ...current, salaryRange: event.target.value }))}
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink/80">Notes</span>
              <textarea
                className="min-h-28 w-full rounded-2xl border border-ink/10 bg-mist px-4 py-3 outline-none focus:border-pine"
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Add interview prep, recruiter notes, or follow-up details."
              />
            </label>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-ink/10 bg-mist/60 p-4">
              <h3 className="font-semibold text-ink">Skills</h3>
              <label className="mt-3 block space-y-2">
                <span className="text-sm font-medium text-ink/80">Required Skills</span>
                <input
                  className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:border-pine"
                  value={form.requiredSkills.join(", ")}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, requiredSkills: parseSkills(event.target.value) }))
                  }
                  placeholder="React, Node.js, JavaScript"
                />
              </label>
              <label className="mt-3 block space-y-2">
                <span className="text-sm font-medium text-ink/80">Nice to Have Skills</span>
                <input
                  className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:border-pine"
                  value={form.niceToHaveSkills.join(", ")}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, niceToHaveSkills: parseSkills(event.target.value) }))
                  }
                  placeholder="Docker, AWS, testing"
                />
              </label>
            </div>

            <div className="rounded-3xl border border-ink/10 bg-mist/60 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-ink">Resume Suggestions</h3>
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-ink/45">
                  3 to 5 bullets
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {form.resumeSuggestions.length ? (
                  form.resumeSuggestions.map((suggestion) => (
                    <div key={suggestion} className="rounded-2xl border border-ink/10 bg-white p-4">
                      <p className="text-sm leading-6 text-ink/80">{suggestion}</p>
                      <button
                        className="mt-3 rounded-xl border border-ink/10 px-3 py-2 text-sm font-medium text-ink/70"
                        onClick={() => handleCopySuggestion(suggestion)}
                        type="button"
                      >
                        Copy
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-6 text-ink/60">
                    Parse a job description to generate tailored resume bullet points.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-ink/10 bg-white p-4">
              <h3 className="font-semibold text-ink">Skills Summary</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {form.requiredSkills.concat(form.niceToHaveSkills).length ? (
                  form.requiredSkills.concat(form.niceToHaveSkills).map((skill) => (
                    <SuggestionPill key={skill} text={skill} />
                  ))
                ) : (
                  <p className="text-sm text-ink/55">Skills will appear here after parsing or manual input.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {errorMessage ? (
          <div className="mt-6 max-h-44 overflow-y-auto break-words rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div className={cn("mt-6 flex flex-wrap items-center justify-between gap-3")}>
          <div>
            {application ? (
              <button
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                onClick={handleDelete}
                type="button"
                disabled={isSaving}
              >
                Delete
              </button>
            ) : null}
          </div>
          <div className="flex gap-3">
            <button
              className="rounded-2xl border border-ink/10 px-4 py-3 text-sm font-semibold text-ink"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              onClick={handleSubmit}
              type="button"
              disabled={isSaving || !form.company.trim() || !form.role.trim()}
            >
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Application"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
