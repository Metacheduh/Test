/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { ContentCopyRounded, LibraryBooksRounded } from "@mui/icons-material";
import { Chip } from "@mui/joy";
import * as React from "react";
import { BackupControls } from "../components/backup-controls";
import { usePageEffect } from "../core/page";
import { usePersistentState } from "../core/storage";

const themes = ["Ethics", "Tax", "Retirement", "Investments", "Risk", "Estate"];

type RoutineKey = "warmup" | "new" | "teach";

export const Component = function CFPStudy(): JSX.Element {
  usePageEffect({ title: "CFP Study" });
  const [weeklyTheme, setWeeklyTheme] = usePersistentState<string>(
    "advisoros_cfp_theme",
    "Ethics",
  );
  const [routine, setRoutine] = usePersistentState<Record<RoutineKey, boolean>>(
    "advisoros_cfp_routine",
    { warmup: false, new: false, teach: false },
  );
  const [clientExplanation, setClientExplanation] = usePersistentState<string>(
    "advisoros_cfp_client_explanation",
    "",
  );

  const copyPrompt = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const handleRoutine = (key: RoutineKey) =>
    setRoutine((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 pb-10 pt-4">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Advisor OS 2026
          </p>
          <h1 className="text-3xl font-semibold text-midnight">CFP Study</h1>
          <p className="text-slate-600">
            Tight loops: theme, prompts, reps, and client-ready explanations.
          </p>
        </div>
        <BackupControls />
      </header>

      <section className="glass-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Weekly theme
            </p>
            <h2 className="card-title">Stay on one lane</h2>
          </div>
          <Chip
            color="primary"
            variant="soft"
            startDecorator={<LibraryBooksRounded />}
          >
            {weeklyTheme}
          </Chip>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {themes.map((theme) => (
            <button
              key={theme}
              onClick={() => setWeeklyTheme(theme)}
              className={`pill ${
                weeklyTheme === theme
                  ? "bg-accent text-white shadow-subtle"
                  : "border border-slate-200 bg-white/80 text-midnight hover:bg-sage/70"
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </section>

      <div className="section-grid">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Gym audio
              </p>
              <h3 className="card-title">Prompt bank</h3>
            </div>
            <span className="tag-pill">Cardio + Lifting</span>
          </div>
          <div className="mt-3 space-y-3">
            <PromptCard
              title="Cardio — dense audio with quizzes"
              onCopy={copyPrompt}
            >
              Turn this topic into a 15-minute cardio audio lesson. Deliver in
              tight, numbered micro-sections. After every section, ask one
              recall question and then answer it. Finish with a 60-second
              summary in plain language plus one client application.
            </PromptCard>
            <PromptCard
              title="Lifting — high level + client explanation"
              onCopy={copyPrompt}
            >
              In 8 minutes, give the 30,000-ft overview of this CFP concept.
              Include 2 client examples and 2 traps to avoid. End with a
              90-second explanation as if you were talking to a thoughtful
              client who is new to the topic.
            </PromptCard>
          </div>
        </div>

        <div className="glass-card p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            After work
          </p>
          <h3 className="card-title">45-minute routine</h3>
          <div className="mt-4 space-y-2">
            <RoutineToggle
              label="10 min review"
              description="Re-voice yesterday's notes, highlight gaps."
              checked={routine.warmup}
              onChange={() => handleRoutine("warmup")}
            />
            <RoutineToggle
              label="25 min new learning"
              description="One focused slice tied to the weekly theme."
              checked={routine.new}
              onChange={() => handleRoutine("new")}
            />
            <RoutineToggle
              label="10 min explain out loud"
              description="Teach an imaginary client or record a voice memo."
              checked={routine.teach}
              onChange={() => handleRoutine("teach")}
            />
          </div>
        </div>
      </div>

      <div className="glass-card p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Explain it like a client
        </p>
        <h3 className="card-title">Write your script</h3>
        <textarea
          className="soft-input mt-3 min-h-[140px]"
          placeholder="Draft the way you'd explain today's topic to a thoughtful client..."
          value={clientExplanation}
          onChange={(event) => setClientExplanation(event.target.value)}
        />
        <p className="mt-2 text-xs text-slate-500">
          Saved locally — reuse in case studies, AI News, or Weekly Reset.
        </p>
      </div>
    </div>
  );
};

function PromptCard({
  title,
  children,
  onCopy,
}: {
  title: string;
  children: React.ReactNode;
  onCopy: (text: string) => Promise<void>;
}): JSX.Element {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white/80 p-3 shadow-subtle">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-midnight">{title}</p>
        </div>
        <button
          className="pill border border-slate-200 bg-white/70 text-xs text-midnight hover:bg-sage/70"
          onClick={() => onCopy(String(children))}
        >
          <ContentCopyRounded fontSize="small" />
          Copy
        </button>
      </div>
      <p className="mt-2 text-sm text-slate-700">{children}</p>
    </div>
  );
}

function RoutineToggle(props: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}): JSX.Element {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border border-slate-100 px-3 py-2 transition hover:shadow-subtle ${
        props.checked ? "bg-sage/80" : "bg-white/80"
      }`}
    >
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 accent-accent"
        checked={props.checked}
        onChange={props.onChange}
      />
      <div>
        <p className="font-semibold text-midnight">{props.label}</p>
        <p className="text-sm text-slate-600">{props.description}</p>
      </div>
    </label>
  );
}
