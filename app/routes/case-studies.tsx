/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { DoneAllRounded, FactCheckRounded } from "@mui/icons-material";
import * as React from "react";
import { BackupControls } from "../components/backup-controls";
import { usePageEffect } from "../core/page";
import { usePersistentState } from "../core/storage";

type CaseStudy = {
  id: string;
  title: string;
  domain: string;
  boundary: string;
  facts: string;
  issues: string;
  options: string;
  recommendation: string;
  clientExplanation: string;
  doAgain: string;
  reviewed: boolean;
  confidence: number;
  notes: string;
  tags: string[];
};

const starterCaseStudies: CaseStudy[] = [
  {
    id: "cs1",
    title: "Dual-income couple, uneven 401(k) match",
    domain: "Retirement",
    boundary: "Internal: clarifying scope vs. tax filing prep",
    facts:
      "Age 36/35, income 240k, employer match 50% up to 6%, spouse only 2%.",
    issues: "Inefficient match capture; unclear Roth vs. pre-tax split.",
    options:
      "A) Max higher match first, B) split contributions Roth/pre based on bracket, C) add backdoor Roth.",
    recommendation:
      "Prioritize higher match, model Roth/pre mix at 24% bracket, start backdoor Roth after emergency fund 3 months.",
    clientExplanation:
      "Let's grab every free dollar first, then choose Roth vs pre-tax so future you pays less tax.",
    doAgain: "Bring visual of match ladder; faster yes.",
    reviewed: false,
    confidence: 7,
    notes: "Share chart showing long-term compounding of match.",
    tags: ["match", "roth", "401k"],
  },
  {
    id: "cs2",
    title: "Founder with concentrated ISO position",
    domain: "Investments",
    boundary: "Internal: pushback on 'just hold everything'",
    facts: "ISO 150k FMV, strike 20k, AMT risk; cash 80k; runway 8 months.",
    issues: "AMT exposure, lack of diversification, liquidity timing.",
    options:
      "Exercise partial with 83(b), staged sells after 1y, QSBS eligibility review.",
    recommendation:
      "Exercise 25% now, monitor AMT with CPA, plan 12-month clock and staged 10b5-1 post-liquidity.",
    clientExplanation:
      "We'll keep upside but cap risk—small exercise now, calendar the tax dates, and pre-plan a sell script.",
    doAgain: "Add AMT threshold guardrail visually.",
    reviewed: false,
    confidence: 6,
    notes: "Need clearer AMT calcs.",
    tags: ["equity", "AMT", "QSBS"],
  },
  {
    id: "cs3",
    title: "Widow pension vs. lump sum",
    domain: "Retirement",
    boundary: "Client expecting 'just pick for me' answer",
    facts: "Age 62, pension 2,100/mo vs. lump 480k; SS at 67; low debt.",
    issues: "Longevity risk, survivor needs, inflation protection.",
    options:
      "A) Take pension with 100% survivor, B) lump and annuitize portion, C) hybrid with SPIA.",
    recommendation:
      "Model hybrid: allocate 280k to SPIA + growth bucket from remainder; ensure survivor safety.",
    clientExplanation:
      "We want paycheck certainty plus growth. This mix keeps checks coming and lets part keep up with costs.",
    doAgain: "Prepare comparison one-pager before meeting.",
    reviewed: false,
    confidence: 8,
    notes: "Add inflation sensitivity table.",
    tags: ["pension", "annuity", "survivor"],
  },
  {
    id: "cs4",
    title: "Cash-heavy client afraid of markets",
    domain: "Investments",
    boundary: "Compassion + boundary: avoid daily check-ins",
    facts: "Cash 600k, income 140k, low expenses, no market exposure.",
    issues: "Inflation drag, fear-driven paralysis, no IPS.",
    options:
      "Build 2-year cash runway + staged DCA; pair with education; guardrail script for volatility.",
    recommendation:
      "Segment buckets: 2-year cash, 3-year DCA into 60/40, monthly check-in limits.",
    clientExplanation:
      "We'll keep two years safe and glide the rest in slowly. We'll check monthly, not daily, so we stay disciplined.",
    doAgain: "Use visual buckets every time.",
    reviewed: false,
    confidence: 7,
    notes: "Share boundary script for 'market panic' calls.",
    tags: ["DCA", "IPS", "behavioral"],
  },
  {
    id: "cs5",
    title: "Complex equity comp + RSUs + ESPP",
    domain: "Tax",
    boundary: "Coordinate with CPA, not replace",
    facts: "RSUs quarterly, ESPP 15% discount, ISO/NSO mix, cash needs soon.",
    issues: "Tax drag, concentration, cash flow timing.",
    options:
      "Sell-to-cover RSUs, diversify quarterly, ESPP sell immediately, ISO ladder.",
    recommendation:
      "Adopt autopilot: sell RSUs on vest, ESPP immediate sale, ISO mini-exercise each quarter with AMT cap.",
    clientExplanation:
      "We’ll turn stock into paycheck-like cash flow and chip away at risk without surprises at tax time.",
    doAgain: "Prepare AMT tolerance band visual.",
    reviewed: false,
    confidence: 8,
    notes: "Add alert for 83(i) conversations.",
    tags: ["RSU", "ESPP", "ISO"],
  },
  {
    id: "cs6",
    title: "Parents funding 529 vs. brokerage",
    domain: "Education",
    boundary: "Scope: advice not direct account access",
    facts: "Kids 5/8, tuition goal 35k/yr, current 529 = 60k.",
    issues: "Liquidity vs. tax benefits, overfunding risk.",
    options: "Max state deduction, blend brokerage, add gift strategy.",
    recommendation:
      "Max state benefit annually, auto-transfer to brokerage for flexibility, revisit every 6 months.",
    clientExplanation:
      "We’ll use the tax break each year but keep part flexible so college choices don’t trap the money.",
    doAgain: "Bring chart of 529 qualified vs. non-qualified uses.",
    reviewed: false,
    confidence: 7,
    notes: "Add FAFSA impact notes.",
    tags: ["529", "education", "liquidity"],
  },
  {
    id: "cs7",
    title: "High earners, no estate docs",
    domain: "Estate",
    boundary: "Internal: insist on estate attorney referral",
    facts: "Net worth 3.4m, two kids, no wills/POA.",
    issues: "Guardianship, medical POA, account titling, beneficiary updates.",
    options:
      "Attorney package, temporary beneficiary audit, vault storage, instruction letter.",
    recommendation:
      "Book attorney intro this week, complete beneficiary sweep, store in shared vault.",
    clientExplanation:
      "This is about who makes decisions if something happens. We’ll lock that in and keep copies where you can find them.",
    doAgain: "Send scheduling link during call.",
    reviewed: false,
    confidence: 9,
    notes: "Track completion dates.",
    tags: ["estate", "beneficiary", "POA"],
  },
  {
    id: "cs8",
    title: "Solo practitioner, irregular income",
    domain: "Cash Flow",
    boundary: "Set communication cadence around draws",
    facts: "Income 12-25k monthly, no system, tax surprises.",
    issues: "No payroll, inconsistent savings, tax withholding gaps.",
    options:
      "Profit-first envelopes, monthly tax sweep, quarterly salary target.",
    recommendation:
      "Adopt 4-account system (income, operating, taxes, pay), automate sweeps weekly.",
    clientExplanation:
      "Each dollar goes into the right bucket automatically so you never wonder if taxes are covered.",
    doAgain: "Share simple tracker template.",
    reviewed: false,
    confidence: 7,
    notes: "Add note about estimated payments.",
    tags: ["cash flow", "self-employed", "tax"],
  },
  {
    id: "cs9",
    title: "Boundary: friend requests free planning",
    domain: "Ethics",
    boundary: "Internal: maintaining professional lines",
    facts: "Close friend asks for detailed plan without engagement.",
    issues: "Scope creep, compensation, liability.",
    options: "Offer paid lite engagement, share education only, decline.",
    recommendation:
      "Provide short education resources + invite to formal engagement with clear scope and fee.",
    clientExplanation:
      "I want to give you quality advice, which means we need a formal engagement so I can do it right.",
    doAgain: "Keep a templated script handy.",
    reviewed: false,
    confidence: 8,
    notes: "Add boundary script to bank.",
    tags: ["boundary", "ethics", "scope"],
  },
  {
    id: "cs10",
    title: "Early retiree considering Roth conversions",
    domain: "Tax",
    boundary: "Coordinate with CPA windows",
    facts: "Age 60, pre-SS, TIRA 1.1m, taxable 300k, low-income years now.",
    issues: "Fill brackets before RMD/SS, IRMAA later.",
    options:
      "Convert up to 22% bracket, consider QCDs later, harvest gains now.",
    recommendation:
      "Fill 22% bracket with annual conversions for 5 years, earmark cash for taxes, revisit at 65 for IRMAA.",
    clientExplanation:
      "We’ll intentionally create income now while taxes are low so future you has smaller required withdrawals.",
    doAgain: "Show IRMAA cliff visual.",
    reviewed: false,
    confidence: 8,
    notes: "Add medicare timing reminders.",
    tags: ["roth conversion", "IRMAA", "RMD"],
  },
];

export const Component = function CaseStudies(): JSX.Element {
  usePageEffect({ title: "Case Studies" });
  const [cases, setCases] = usePersistentState<CaseStudy[]>(
    "advisoros_case_studies",
    starterCaseStudies,
  );
  const [form, setForm] = React.useState<
    Omit<CaseStudy, "id" | "reviewed" | "confidence" | "tags">
  >({
    title: "",
    domain: "Retirement",
    boundary: "",
    facts: "",
    issues: "",
    options: "",
    recommendation: "",
    clientExplanation: "",
    doAgain: "",
    notes: "",
  });
  const [tags, setTags] = React.useState<string>("");

  const addCase = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim()) return;

    const newCase: CaseStudy = {
      ...form,
      id: `case-${Date.now()}`,
      reviewed: false,
      confidence: 5,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    setCases((prev) => [newCase, ...prev]);
    setForm({
      title: "",
      domain: "Retirement",
      boundary: "",
      facts: "",
      issues: "",
      options: "",
      recommendation: "",
      clientExplanation: "",
      doAgain: "",
      notes: "",
    });
    setTags("");
  };

  const updateCase = (id: string, update: Partial<CaseStudy>) => {
    setCases((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...update } : item)),
    );
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 pb-10 pt-4">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Advisor OS 2026
          </p>
          <h1 className="text-3xl font-semibold text-midnight">Case Studies</h1>
          <p className="text-slate-600">
            Guided walkthroughs, confidence scores, and boundary reps.
          </p>
        </div>
        <BackupControls />
      </header>

      <section className="glass-card p-4">
        <div className="flex items-start gap-2">
          <FactCheckRounded className="mt-0.5 text-indigo-500" />
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Guided walkthrough
            </p>
            <h3 className="card-title">Add a fresh case</h3>
          </div>
        </div>
        <form className="mt-3 grid gap-3 md:grid-cols-2" onSubmit={addCase}>
          <input
            required
            className="soft-input"
            placeholder="Title"
            value={form.title}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
          />
          <select
            className="soft-input"
            value={form.domain}
            onChange={(event) =>
              setForm({ ...form, domain: event.target.value })
            }
          >
            <option>Retirement</option>
            <option>Investments</option>
            <option>Risk</option>
            <option>Estate</option>
            <option>Tax</option>
            <option>Education</option>
            <option>Ethics</option>
            <option>Cash Flow</option>
          </select>
          <input
            className="soft-input md:col-span-2"
            placeholder="Boundary scenario (acknowledge → constraint → options)"
            value={form.boundary}
            onChange={(event) =>
              setForm({ ...form, boundary: event.target.value })
            }
          />
          <textarea
            className="soft-input md:col-span-2"
            placeholder="Facts"
            value={form.facts}
            onChange={(event) =>
              setForm({ ...form, facts: event.target.value })
            }
          />
          <textarea
            className="soft-input md:col-span-2"
            placeholder="Issues"
            value={form.issues}
            onChange={(event) =>
              setForm({ ...form, issues: event.target.value })
            }
          />
          <textarea
            className="soft-input md:col-span-2"
            placeholder="Options"
            value={form.options}
            onChange={(event) =>
              setForm({ ...form, options: event.target.value })
            }
          />
          <textarea
            className="soft-input md:col-span-2"
            placeholder="Recommendation"
            value={form.recommendation}
            onChange={(event) =>
              setForm({ ...form, recommendation: event.target.value })
            }
          />
          <textarea
            className="soft-input md:col-span-2"
            placeholder="Client explanation"
            value={form.clientExplanation}
            onChange={(event) =>
              setForm({ ...form, clientExplanation: event.target.value })
            }
          />
          <textarea
            className="soft-input md:col-span-2"
            placeholder="What I'd do again"
            value={form.doAgain}
            onChange={(event) =>
              setForm({ ...form, doAgain: event.target.value })
            }
          />
          <input
            className="soft-input"
            placeholder="Notes"
            value={form.notes}
            onChange={(event) =>
              setForm({ ...form, notes: event.target.value })
            }
          />
          <input
            className="soft-input"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
          />
          <button
            type="submit"
            className="pill bg-midnight text-white shadow-subtle hover:shadow-lg md:col-span-2"
          >
            Add case study
          </button>
        </form>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        {cases.map((item) => (
          <article key={item.id} className="glass-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {item.domain}
                </p>
                <h3 className="text-lg font-semibold text-midnight">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500">{item.boundary}</p>
              </div>
              <label className="flex items-center gap-1 text-xs text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-accent"
                  checked={item.reviewed}
                  onChange={() =>
                    updateCase(item.id, { reviewed: !item.reviewed })
                  }
                />
                <span>Reviewed</span>
              </label>
            </div>

            <dl className="mt-2 space-y-1 text-sm text-slate-700">
              <Row label="Facts" value={item.facts} />
              <Row label="Issues" value={item.issues} />
              <Row label="Options" value={item.options} />
              <Row label="Recommendation" value={item.recommendation} />
              <Row label="Client explanation" value={item.clientExplanation} />
              <Row label="What I'd do again" value={item.doAgain} />
              <Row label="Notes" value={item.notes} />
            </dl>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <DoneAllRounded className="text-accent" />
              <span className="text-xs font-semibold text-slate-600">
                Confidence: {item.confidence}/10
              </span>
              <input
                type="range"
                min={1}
                max={10}
                value={item.confidence}
                onChange={(event) =>
                  updateCase(item.id, {
                    confidence: Number(event.target.value),
                  })
                }
              />
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

function Row(props: { label: string; value: string }): JSX.Element {
  return (
    <div>
      <span className="font-semibold text-midnight">{props.label}: </span>
      <span className="text-slate-700">{props.value}</span>
    </div>
  );
}
