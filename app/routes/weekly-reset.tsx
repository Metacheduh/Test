/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { ChecklistRounded, EventRepeatRounded } from "@mui/icons-material";
import * as React from "react";
import { BackupControls } from "../components/backup-controls";
import { usePageEffect } from "../core/page";
import { usePersistentState } from "../core/storage";

type ResetState = {
  checklist: Record<string, boolean>;
  cfpTheme: string;
  scripts: string[];
  dateIdea: string;
  aiTopics: string[];
};

const defaultState: ResetState = {
  checklist: {
    reviewCalendar: false,
    prepMeals: false,
    planWorkouts: false,
    clearInbox: false,
    gratitude: false,
  },
  cfpTheme: "Ethics",
  scripts: ["", "", ""],
  dateIdea: "",
  aiTopics: ["", "", ""],
};

const checklistCopy: Record<string, string> = {
  reviewCalendar: "Sunday planning: confirm calendar + appointments",
  prepMeals: "Prep meals/groceries mapped to workouts",
  planWorkouts: "Plan workouts + commutes",
  clearInbox: "Inbox zero sweep + ready Monday priorities",
  gratitude: "Two gratitude notes sent",
};

export const Component = function WeeklyReset(): JSX.Element {
  usePageEffect({ title: "Weekly Reset" });
  const [state, setState] = usePersistentState<ResetState>(
    "advisoros_weekly_reset",
    defaultState,
  );

  const toggleChecklist = (key: string) =>
    setState((prev) => ({
      ...prev,
      checklist: { ...prev.checklist, [key]: !prev.checklist[key] },
    }));

  const updateScripts = (index: number, value: string) =>
    setState((prev) => {
      const scripts = [...prev.scripts];
      scripts[index] = value;
      return { ...prev, scripts };
    });

  const updateAiTopics = (index: number, value: string) =>
    setState((prev) => {
      const aiTopics = [...prev.aiTopics];
      aiTopics[index] = value;
      return { ...prev, aiTopics };
    });

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 pb-10 pt-4">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Advisor OS 2026
          </p>
          <h1 className="text-3xl font-semibold text-midnight">Weekly Reset</h1>
          <p className="text-slate-600">
            Sunday rituals to lock in the week: checklist, themes, scripts, and
            ideas.
          </p>
        </div>
        <BackupControls />
      </header>

      <section className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Sunday planning
            </p>
            <h3 className="card-title">Checklist</h3>
          </div>
          <ChecklistRounded className="text-indigo-500" />
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {Object.entries(checklistCopy).map(([key, label]) => (
            <label
              key={key}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border border-slate-100 px-3 py-2 transition hover:shadow-subtle ${
                state.checklist[key] ? "bg-sage/80" : "bg-white/80"
              }`}
            >
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-accent"
                checked={state.checklist[key]}
                onChange={() => toggleChecklist(key)}
              />
              <span className="text-sm text-midnight">{label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="section-grid">
        <div className="glass-card p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            CFP focus
          </p>
          <h3 className="card-title">Pick weekly theme</h3>
          <select
            className="soft-input mt-3"
            value={state.cfpTheme}
            onChange={(event) =>
              setState((prev) => ({ ...prev, cfpTheme: event.target.value }))
            }
          >
            <option>Ethics</option>
            <option>Tax</option>
            <option>Retirement</option>
            <option>Investments</option>
            <option>Risk</option>
            <option>Estate</option>
          </select>
        </div>

        <div className="glass-card p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Boundaries
          </p>
          <h3 className="card-title">Pick 3 scripts</h3>
          <div className="mt-3 space-y-2">
            {state.scripts.map((script, index) => (
              <input
                key={index}
                className="soft-input"
                placeholder={`Script ${index + 1}`}
                value={script}
                onChange={(event) => updateScripts(index, event.target.value)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-grid">
        <div className="glass-card p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Relationships
          </p>
          <h3 className="card-title">Date idea</h3>
          <input
            className="soft-input mt-3"
            placeholder="Pick one thoughtful date idea"
            value={state.dateIdea}
            onChange={(event) =>
              setState((prev) => ({ ...prev, dateIdea: event.target.value }))
            }
          />
        </div>

        <div className="glass-card p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            AI topics
          </p>
          <h3 className="card-title">Pick 3 to watch</h3>
          <div className="mt-3 space-y-2">
            {state.aiTopics.map((topic, index) => (
              <input
                key={index}
                className="soft-input"
                placeholder={`AI topic ${index + 1}`}
                value={topic}
                onChange={(event) => updateAiTopics(index, event.target.value)}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="glass-card p-4">
        <div className="flex items-center gap-2">
          <EventRepeatRounded className="text-indigo-500" />
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Weekly snapshot
            </p>
            <h3 className="card-title">Keep it visible</h3>
          </div>
        </div>
        <ul className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
          <li>Theme: {state.cfpTheme}</li>
          <li>Date idea: {state.dateIdea || "Not chosen yet"}</li>
          <li>
            Scripts: {state.scripts.filter(Boolean).join(", ") || "Not chosen"}
          </li>
          <li>
            AI topics:{" "}
            {state.aiTopics.filter(Boolean).join(", ") || "Not chosen"}
          </li>
        </ul>
      </div>
    </div>
  );
};
