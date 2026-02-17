/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import {
  BoltRounded,
  CheckCircleRounded,
  LightModeRounded,
  ScheduleRounded,
  VisibilityOffRounded,
} from "@mui/icons-material";
import { Chip, Switch } from "@mui/joy";
import * as React from "react";
import { BackupControls } from "../components/backup-controls";
import { usePageEffect } from "../core/page";
import { usePersistentState } from "../core/storage";

type ChecklistKey = "cfp" | "ai" | "relationship" | "mental" | "boundary";

type ChecklistItem = {
  key: ChecklistKey;
  label: string;
  description: string;
};

type ScheduleBlock = {
  label: string;
  start: string;
  end: string;
  focus?: string;
};

const checklistItems: ChecklistItem[] = [
  {
    key: "cfp",
    label: "CFP – 45 minutes",
    description: "Push one theme forward.",
  },
  {
    key: "ai",
    label: "AI Reading – 45 minutes",
    description: "Capture one takeaway.",
  },
  {
    key: "relationship",
    label: "Relationship rep",
    description: "One proactive, kind touch point.",
  },
  {
    key: "mental",
    label: "Mental health check-in",
    description: "Brief reflection + breathing.",
  },
  {
    key: "boundary",
    label: "Boundary rehearsal",
    description: "5-minute scenario practice.",
  },
];

const schedule: ScheduleBlock[] = [
  {
    label: "Wake",
    start: "05:00",
    end: "06:00",
    focus: "Hydrate + quick plan",
  },
  {
    label: "Gym",
    start: "06:00",
    end: "07:00",
    focus: "Cardio/Lifting prompt",
  },
  { label: "Home", start: "07:00", end: "08:00", focus: "Reset + prep" },
  { label: "Drive", start: "08:00", end: "08:15", focus: "Stacked audio cue" },
  { label: "Work", start: "08:30", end: "17:00", focus: "Deep work blocks" },
  {
    label: "Home",
    start: "17:00",
    end: "21:00",
    focus: "Recovery + relationships",
  },
  { label: "Sleep", start: "22:00", end: "05:00", focus: "Wind-down ritual" },
];

export const Component = function Today(): JSX.Element {
  usePageEffect({ title: "Today" });
  const [checklist, setChecklist] = usePersistentState<
    Record<ChecklistKey, boolean>
  >("advisoros_today_checklist", {
    cfp: false,
    ai: false,
    relationship: false,
    mental: false,
    boundary: false,
  });
  const [focusMode, setFocusMode] = usePersistentState<boolean>(
    "advisoros_focus_mode",
    false,
  );

  const [nowBlock, setNowBlock] = React.useState(() =>
    computeNextBlock(schedule),
  );

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      setNowBlock(computeNextBlock(schedule));
    }, 60 * 1000);

    return () => window.clearInterval(interval);
  }, []);

  const toggleChecklist = (key: ChecklistKey) =>
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 pb-6 pt-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.15em] text-slate-500">
            Advisor OS 2026
          </p>
          <h1 className="text-3xl font-semibold text-midnight">Today</h1>
          <p className="text-slate-600">
            Purpose-built rhythm, fast access to the next important thing.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 shadow-subtle">
          <div className="flex items-center gap-2">
            <LightModeRounded className="text-amber-500" />
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Next up
              </p>
              <p className="text-sm font-semibold text-midnight">
                {nowBlock.label}
              </p>
              <p className="text-xs text-slate-500">{formatRange(nowBlock)}</p>
            </div>
          </div>
          <Chip
            color="primary"
            variant="soft"
            size="sm"
            startDecorator={<BoltRounded />}
          >
            {nowBlock.focus}
          </Chip>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 shadow-subtle">
          <Switch
            checked={focusMode}
            onChange={() => setFocusMode((value) => !value)}
            startDecorator={<VisibilityOffRounded />}
          />
          <span className="text-sm font-medium text-midnight">Focus mode</span>
        </label>

        <BackupControls />
      </div>

      <div className={cx("section-grid", focusMode && "md:grid-cols-1")}>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Daily Checklist
              </p>
              <h2 className="card-title">Keep the streak</h2>
            </div>
            <CheckCircleRounded className="text-accent" />
          </div>
          <div className="mt-3 space-y-2">
            {checklistItems.map((item) => (
              <label
                key={item.key}
                className={cx(
                  "flex cursor-pointer items-start gap-3 rounded-xl border border-slate-100 px-3 py-2 transition hover:shadow-subtle",
                  checklist[item.key] ? "bg-sage/70" : "bg-white/70",
                )}
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-accent"
                  checked={checklist[item.key]}
                  onChange={() => toggleChecklist(item.key)}
                />
                <div>
                  <p className="font-medium text-midnight">{item.label}</p>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {!focusMode && (
          <div className="glass-card p-4">
            <div className="flex items-center gap-2">
              <ScheduleRounded className="text-indigo-500" />
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Rhythm
                </p>
                <h2 className="card-title">Schedule map (ET)</h2>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {schedule.map((block) => {
                const active = isCurrentBlock(block);
                return (
                  <div
                    key={block.label}
                    className={cx(
                      "flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2 text-sm transition",
                      active ? "bg-accent/10 border-accent/40" : "bg-white/70",
                    )}
                  >
                    <div>
                      <p className="font-semibold text-midnight">
                        {block.label}
                      </p>
                      <p className="text-xs text-slate-500">{block.focus}</p>
                    </div>
                    <div className="text-xs font-semibold text-slate-600">
                      {formatRange(block)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {!focusMode && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="glass-card p-4 lg:col-span-2">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Daily orientation
            </p>
            <h3 className="card-title">Priority notes</h3>
            <ul className="mt-3 grid list-disc gap-2 pl-5 text-sm text-slate-700 md:grid-cols-2">
              <li>Confirm top 3 priorities before 9am.</li>
              <li>One boundary rep + one relationship rep.</li>
              <li>Capture one AI takeaway to reuse with clients.</li>
              <li>Close day with 10-minute reset and tomorrow preview.</li>
            </ul>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Shortcuts
            </p>
            <h3 className="card-title">Quick links</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <QuickPill label="CFP Study" href="/cfp-study" />
              <QuickPill label="Case Studies" href="/case-studies" />
              <QuickPill label="Boundaries" href="/boundaries" />
              <QuickPill label="AI News" href="/ai-news" />
              <QuickPill label="Weekly Reset" href="/weekly-reset" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function formatRange(block: ScheduleBlock): string {
  return `${block.start} – ${block.end}`;
}

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function computeNextBlock(blocks: ScheduleBlock[]): ScheduleBlock {
  const now = new Date();
  const nyNow = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" }),
  );
  const minutes = nyNow.getHours() * 60 + nyNow.getMinutes();

  const current =
    blocks.find((block) => isNowWithinBlock(minutes, block)) ??
    blocks.find((block) => timeToMinutes(block.start) > minutes) ??
    blocks[0];

  return current;
}

function isNowWithinBlock(nowMinutes: number, block: ScheduleBlock): boolean {
  const start = timeToMinutes(block.start);
  const end = timeToMinutes(block.end);

  if (end < start) {
    // Overnight block
    return nowMinutes >= start || nowMinutes < end;
  }

  return nowMinutes >= start && nowMinutes < end;
}

function isCurrentBlock(block: ScheduleBlock): boolean {
  const now = new Date();
  const nyNow = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" }),
  );
  const minutes = nyNow.getHours() * 60 + nyNow.getMinutes();
  return isNowWithinBlock(minutes, block);
}

function QuickPill(props: { label: string; href: string }): JSX.Element {
  return (
    <a
      href={props.href}
      className="pill border border-slate-200 bg-white/80 text-midnight hover:bg-sage/70"
    >
      {props.label}
    </a>
  );
}
