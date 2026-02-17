/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { LinkRounded, NewspaperRounded } from "@mui/icons-material";
import * as React from "react";
import { BackupControls } from "../components/backup-controls";
import { usePageEffect } from "../core/page";
import { usePersistentState } from "../core/storage";

type NewsEntry = {
  id: string;
  topic: string;
  link: string;
  takeaway: string;
  category: string;
  applies: boolean;
};

export const Component = function AINews(): JSX.Element {
  usePageEffect({ title: "AI News" });
  const [entries, setEntries] = usePersistentState<NewsEntry[]>(
    "advisoros_ai_news",
    [],
  );

  const addEntry = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const entry: NewsEntry = {
      id: `ai-${Date.now()}`,
      topic: String(form.get("topic") ?? ""),
      link: String(form.get("link") ?? ""),
      takeaway: String(form.get("takeaway") ?? ""),
      category: String(form.get("category") ?? ""),
      applies: Boolean(form.get("applies")),
    };
    setEntries((prev) => [entry, ...prev]);
    event.currentTarget.reset();
  };

  const toggleApplies = (id: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, applies: !entry.applies } : entry,
      ),
    );
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 pb-10 pt-4">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Advisor OS 2026
          </p>
          <h1 className="text-3xl font-semibold text-midnight">AI News Log</h1>
          <p className="text-slate-600">
            Capture topics, links, takeaways, and whether they apply to clients
            or workflow.
          </p>
        </div>
        <BackupControls />
      </header>

      <section className="glass-card p-4">
        <div className="flex items-center gap-2">
          <NewspaperRounded className="text-indigo-500" />
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Log entry
            </p>
            <h3 className="card-title">Add the takeaway</h3>
          </div>
        </div>
        <form className="mt-3 grid gap-3 md:grid-cols-2" onSubmit={addEntry}>
          <input
            required
            name="topic"
            className="soft-input"
            placeholder="Topic"
          />
          <input
            name="link"
            className="soft-input"
            placeholder="Link"
            type="url"
          />
          <input
            name="category"
            className="soft-input"
            placeholder="Category (e.g., model, tooling, regulation)"
          />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              name="applies"
              type="checkbox"
              className="h-4 w-4 accent-accent"
            />
            Applies to clients/workflow
          </label>
          <textarea
            name="takeaway"
            className="soft-input md:col-span-2"
            placeholder="One-sentence takeaway"
          />
          <button
            type="submit"
            className="pill bg-midnight text-white shadow-subtle hover:shadow-lg md:col-span-2"
          >
            Save entry
          </button>
        </form>
      </section>

      {entries.length > 0 && (
        <section className="grid gap-3 md:grid-cols-2">
          {entries.map((entry) => (
            <article key={entry.id} className="glass-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {entry.category || "General"}
                  </p>
                  <h3 className="text-lg font-semibold text-midnight">
                    {entry.topic}
                  </h3>
                  {entry.link && (
                    <a
                      className="inline-flex items-center gap-1 text-sm text-accent underline"
                      href={entry.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <LinkRounded fontSize="small" />
                      Source
                    </a>
                  )}
                </div>
                <label className="flex items-center gap-1 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-accent"
                    checked={entry.applies}
                    onChange={() => toggleApplies(entry.id)}
                  />
                  Applies
                </label>
              </div>
              <p className="mt-2 text-sm text-slate-700">{entry.takeaway}</p>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};
