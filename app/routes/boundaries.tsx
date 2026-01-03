/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import {
  DescriptionRounded,
  PlayArrowRounded,
  ReplayRounded,
} from "@mui/icons-material";
import * as React from "react";
import { BackupControls } from "../components/backup-controls";
import { usePageEffect } from "../core/page";
import { usePersistentState } from "../core/storage";

type ScriptTemplate = {
  id: string;
  name: string;
  template: string;
};

type RehearsalLog = {
  id: string;
  scenario: string;
  person: string;
  script: string;
  anxietyBefore: number;
  anxietyAfter: number;
  outcome: string;
};

const defaultScripts: ScriptTemplate[] = [
  {
    id: "scope",
    name: "Scope protection",
    template:
      "Acknowledge: I hear this is urgent. Constraint: I want to give quality advice, which means we need a scoped engagement. Options: I can send two resources now, and we can book a full session this week or start a limited-scope project.",
  },
  {
    id: "timeline",
    name: "Timeline reset",
    template:
      "Acknowledge: I understand the deadline feels close. Constraint: A thorough plan takes a bit of time so we avoid misses. Options: We can prioritize the top two items today and schedule the full plan for next week.",
  },
  {
    id: "fees",
    name: "Fee clarity",
    template:
      "Acknowledge: You want to be sure this is worth it. Constraint: I provide regulated advice and need a formal engagement. Options: I can outline deliverables now and send the agreement so you can decide with full clarity.",
  },
];

const scenarios = [
  "Client insists on daily market check-ins.",
  "Friend asking for full plan for free.",
  "Team member wants weekend availability.",
  "Prospect wants tax filing help outside scope.",
  "Client pushing for high-risk allocation despite IPS.",
  "Stakeholder asks to skip compliance steps.",
];

export const Component = function Boundaries(): JSX.Element {
  usePageEffect({ title: "Boundaries & Confidence" });
  const [scripts, setScripts] = usePersistentState<ScriptTemplate[]>(
    "advisoros_scripts",
    defaultScripts,
  );
  const [log, setLog] = usePersistentState<RehearsalLog[]>(
    "advisoros_boundary_log",
    [],
  );
  const [scenario, setScenario] = React.useState<string>(scenarios[0]);
  const [timer, setTimer] = React.useState<number>(300);
  const [isRunning, setIsRunning] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!isRunning) return;
    const interval = window.setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const addLog = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const entry: RehearsalLog = {
      id: `log-${Date.now()}`,
      scenario: String(formData.get("scenario") ?? ""),
      person: String(formData.get("person") ?? ""),
      script: String(formData.get("script") ?? ""),
      anxietyBefore: Number(formData.get("before") ?? 0),
      anxietyAfter: Number(formData.get("after") ?? 0),
      outcome: String(formData.get("outcome") ?? ""),
    };
    setLog((prev) => [entry, ...prev]);
    event.currentTarget.reset();
  };

  const updateTemplate = (id: string, value: string) => {
    setScripts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, template: value } : s)),
    );
  };

  const randomizeScenario = () => {
    const pick = scenarios[Math.floor(Math.random() * scenarios.length)];
    setScenario(pick);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 pb-10 pt-4">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
            Advisor OS 2026
          </p>
          <h1 className="text-3xl font-semibold text-midnight">
            Boundaries & Confidence
          </h1>
          <p className="text-slate-600">
            Scripts, rehearsal timer, and a log to desensitize the spikes.
          </p>
        </div>
        <BackupControls />
      </header>

      <section className="section-grid">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Script bank
              </p>
              <h3 className="card-title">Acknowledge → Constraint → Options</h3>
            </div>
            <DescriptionRounded className="text-indigo-500" />
          </div>
          <div className="mt-3 space-y-3">
            {scripts.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-100 bg-white/80 p-3 shadow-subtle"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-midnight">{item.name}</p>
                  <span className="tag-pill">Editable</span>
                </div>
                <textarea
                  className="soft-input mt-2 min-h-[80px]"
                  value={item.template}
                  onChange={(event) =>
                    updateTemplate(item.id, event.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Rehearsal
          </p>
          <h3 className="card-title">5-minute timer + random scenario</h3>
          <div className="mt-3 flex items-center gap-3">
            <div className="rounded-2xl bg-midnight px-5 py-3 text-center text-white shadow-subtle">
              <p className="text-xs uppercase text-sage">Countdown</p>
              <p className="text-3xl font-semibold">{formatTime(timer)}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                className="pill bg-accent text-white shadow-subtle"
                onClick={() => setIsRunning((prev) => !prev)}
              >
                <PlayArrowRounded />
                {isRunning ? "Pause" : "Start"}
              </button>
              <button
                className="pill border border-slate-200 bg-white/80 text-midnight hover:bg-sage/70"
                onClick={() => {
                  setTimer(300);
                  setIsRunning(false);
                }}
              >
                <ReplayRounded />
                Reset
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-2 rounded-xl bg-white/70 p-3 shadow-subtle">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Scenario
                </p>
                <p className="font-semibold text-midnight">{scenario}</p>
              </div>
              <button
                className="pill border border-slate-200 bg-white text-sm text-midnight hover:bg-sage/70"
                onClick={randomizeScenario}
              >
                Randomize
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Rehearsal log
        </p>
        <h3 className="card-title">Track reps & nervous system shifts</h3>
        <form className="mt-3 grid gap-3 md:grid-cols-3" onSubmit={addLog}>
          <input
            name="scenario"
            required
            className="soft-input"
            placeholder="Scenario"
            defaultValue={scenario}
          />
          <input name="person" className="soft-input" placeholder="Person" />
          <input
            name="script"
            className="soft-input"
            placeholder="Script used"
            defaultValue={scripts[0]?.name}
          />
          <label className="text-sm text-slate-700">
            Anxiety before:{" "}
            <input
              name="before"
              type="number"
              min={1}
              max={10}
              defaultValue={6}
              className="soft-input mt-1"
            />
          </label>
          <label className="text-sm text-slate-700">
            Anxiety after:{" "}
            <input
              name="after"
              type="number"
              min={1}
              max={10}
              defaultValue={4}
              className="soft-input mt-1"
            />
          </label>
          <input
            name="outcome"
            className="soft-input md:col-span-3"
            placeholder="Outcome or notes"
          />
          <button
            type="submit"
            className="pill bg-midnight text-white shadow-subtle hover:shadow-lg md:col-span-3"
          >
            Log rehearsal
          </button>
        </form>

        {log.length > 0 && (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {log.map((entry) => (
              <article
                key={entry.id}
                className="rounded-xl border border-slate-100 bg-white/80 p-3 shadow-subtle"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-midnight">
                      {entry.scenario}
                    </p>
                    <p className="text-xs text-slate-500">
                      With: {entry.person || "—"}
                    </p>
                  </div>
                  <span className="tag-pill">{entry.script || "Script"}</span>
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  {entry.outcome || "No notes yet."}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Anxiety {entry.anxietyBefore}/10 → {entry.anxietyAfter}/10
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
