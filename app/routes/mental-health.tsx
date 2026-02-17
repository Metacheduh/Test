/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { FavoriteRounded, MoodRounded } from "@mui/icons-material";
import * as React from "react";
import { BackupControls } from "../components/backup-controls";
import { usePageEffect } from "../core/page";
import { usePersistentState } from "../core/storage";

type CheckIn = {
  date: string;
  mood: number;
  stress: number;
  tools: string;
  notes: string;
};

const todayISO = () => new Date().toISOString().slice(0, 10);

export const Component = function MentalHealth(): JSX.Element {
  usePageEffect({ title: "Mental Health" });
  const [entries, setEntries] = usePersistentState<CheckIn[]>(
    "advisoros_mental_health",
    [],
  );
  const [windowSize, setWindowSize] = React.useState<14 | 30>(14);

  const addEntry = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const entry: CheckIn = {
      date: String(form.get("date") ?? todayISO()),
      mood: Number(form.get("mood") ?? 0),
      stress: Number(form.get("stress") ?? 0),
      tools: String(form.get("tools") ?? ""),
      notes: String(form.get("notes") ?? ""),
    };
    setEntries((prev) => {
      const filtered = prev.filter((item) => item.date !== entry.date);
      return [entry, ...filtered].sort((a, b) => (a.date < b.date ? 1 : -1));
    });
    event.currentTarget.reset();
  };

  const recent = entries.slice(0, windowSize);

  const helper = computeHelpfulTool(recent);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 pb-10 pt-4">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Advisor OS 2026
          </p>
          <h1 className="text-3xl font-semibold text-midnight">
            Mental Health
          </h1>
          <p className="text-slate-600">
            Daily check-ins, simple trends, and a reminder of what helped most.
          </p>
        </div>
        <BackupControls />
      </header>

      <section className="glass-card p-4">
        <div className="flex items-center gap-2">
          <MoodRounded className="text-indigo-500" />
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Daily check-in
            </p>
            <h3 className="card-title">Capture the signal</h3>
          </div>
        </div>
        <form className="mt-3 grid gap-3 md:grid-cols-2" onSubmit={addEntry}>
          <input
            name="date"
            type="date"
            className="soft-input"
            defaultValue={todayISO()}
            required
          />
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-700">Mood 1–10</label>
            <input
              name="mood"
              type="range"
              min={1}
              max={10}
              defaultValue={7}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-700">Stress 1–10</label>
            <input
              name="stress"
              type="range"
              min={1}
              max={10}
              defaultValue={4}
              className="w-full"
            />
          </div>
          <input
            name="tools"
            className="soft-input md:col-span-2"
            placeholder="Tools used (comma separated)"
          />
          <textarea
            name="notes"
            className="soft-input md:col-span-2"
            placeholder="Notes"
          />
          <button
            type="submit"
            className="pill bg-midnight text-white shadow-subtle hover:shadow-lg md:col-span-2"
          >
            Save check-in
          </button>
        </form>
      </section>

      <section className="glass-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Trends
            </p>
            <h3 className="card-title">
              Mood & stress (last {windowSize} days)
            </h3>
          </div>
          <select
            className="soft-input max-w-[140px]"
            value={windowSize}
            onChange={(event) =>
              setWindowSize(Number(event.target.value) as 14 | 30)
            }
          >
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
        </div>

        {recent.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">
            Log a check-in to see trends.
          </p>
        ) : (
          <>
            <div className="mt-4 grid gap-2 rounded-xl bg-white/80 p-3 shadow-subtle">
              <div className="flex items-end gap-2">
                {recent
                  .slice()
                  .reverse()
                  .map((entry) => (
                    <div
                      key={entry.date}
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        className="w-4 rounded-full bg-accent"
                        style={{ height: `${entry.mood * 8}px` }}
                        title={`Mood ${entry.mood}`}
                      />
                      <div
                        className="w-4 rounded-full bg-sage"
                        style={{ height: `${entry.stress * 8}px` }}
                        title={`Stress ${entry.stress}`}
                      />
                      <span className="text-[10px] text-slate-500">
                        {entry.date.slice(5)}
                      </span>
                    </div>
                  ))}
              </div>
              <div className="text-xs text-slate-500">
                Blue = mood, Green = stress (lower is calmer).
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <FavoriteRounded className="text-rose-500" />
              <p className="text-sm font-semibold text-midnight">
                What helped most: {helper || "log tools to see the pattern"}
              </p>
            </div>
          </>
        )}
      </section>

      {entries.length > 0 && (
        <section className="grid gap-3 md:grid-cols-2">
          {entries.map((entry) => (
            <article key={entry.date} className="glass-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {entry.date}
                  </p>
                  <h3 className="text-lg font-semibold text-midnight">
                    Mood {entry.mood}/10 · Stress {entry.stress}/10
                  </h3>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-700">
                Tools: {entry.tools || "—"}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {entry.notes || "No notes"}
              </p>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

function computeHelpfulTool(entries: CheckIn[]): string | null {
  const counts: Record<string, number> = {};
  entries.forEach((entry) => {
    entry.tools
      .split(",")
      .map((tool) => tool.trim())
      .filter(Boolean)
      .forEach((tool) => {
        counts[tool] = (counts[tool] || 0) + 1;
      });
  });
  const [top] = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return top ? `${top[0]} (${top[1]}x)` : null;
}
