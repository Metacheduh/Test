# Opus Build Plan for Claude: Modular Sprint Framework

Use this framework to build Opus safely and efficiently in focused architectural slices. It is designed to reduce logic drift and runtime instability by constraining each sprint to one core layer.

## Operating Guardrails (apply to every sprint)

- Work in strict sprint order: Foundation -> Intake -> Wizards -> Insights.
- Do not start the next sprint until current sprint acceptance criteria pass.
- Keep a deterministic calculation core; isolate AI/LLM features behind validation gates.
- Apply the **3-Second Rule** to all primary visuals:
  - Green = inflows
  - Blue = investments
  - Red = shortfalls
- Use progressive disclosure for advanced tax details (e.g., hide complex tables unless the user opens a detailed year view).
- Add a global **Privacy Mode** toggle that hides client names and replaces visible identity labels with neutral placeholders and search.

---

## Sprint 1 — The Financial Brain (Data + 2026 Tax Engine)

### Goal

Establish the 100-year timeline and deterministic 2026 calculation engine aligned with OBBBA and SECURE 2.0 constraints.

### Claude prompt

> I am building Opus, a financial planning app for visual learners. We are starting with Sprint 1: The Foundation.
>
> 1. JSON Schema: Create a data structure for a Client Case with:
>
> - Clients (name, DOB)
> - Incomes (salary, tips, overtime)
> - Expenses (Essential vs Leisure)
>
> 2. 2026 Tax Engine: Implement OBBBA federal brackets (7 brackets, 10%-37%) and standard deductions:
>
> - Single: $16,100
> - Joint: $32,200
>
> 3. Special 2026 Rules:
>
> - Senior bonus deduction: +$6,000 per person age 65+, phasing out at $75k Single / $150k Joint
> - 401(k) limits: $24,500 base + $11,250 super catch-up for ages 60-63
> - Roth mandate: if prior-year FICA wages exceed $150k, force catch-up contributions to Roth
>
> 4. Visual logic:
>
> - Need Line system:
>   - Black Line = Total Expenses + Taxes
>   - Light Blue Line = Essential Basics only
> - Any bar below Black Line must render in Red.

### Acceptance criteria

- 100-year annualized timeline generator available in core model.
- Tax calculations are deterministic for identical inputs.
- Senior bonus, 401(k) limits, and Roth mandate logic are unit-tested.
- Need Line color state transitions correctly when income drops below Black Line.

---

## Sprint 2 — AI Intake Portal (Auto-Populate)

### Goal

Build secure document ingestion that minimizes manual entry while preserving human validation before chart updates.

### Claude prompt

> Proceed to Sprint 2: AI Intake Portal. Build Intelligent Document Extraction:
>
> 1. Form Mapping (OCR/NLP):
>
> - W-2 (specifically Box 3 for Roth mandate eligibility)
> - Form 1040
> - Form 1099-R / 1099-INT / 1099-DIV
>
> 2. Gap Detection:
>
> - Notify user when mandatory 2026 tax documents are missing, including Schedule 1-A (car interest) when applicable.
>
> 3. Validation workflow:
>
> - Human-in-the-loop review screen where advisor confirms extracted values before they flow into real-time charts.

### Acceptance criteria

- Extracted fields are mapped to canonical schema with source confidence metadata.
- Missing-required-document checks trigger explicit UI alerts.
- No extracted value updates planning charts without advisor confirmation.

---

## Sprint 3 — Guided Plan Wizards (Life Events)

### Goal

Implement wizard flows for key planning events with immediate timeline and solvency impact.

### Claude prompt

> Proceed to Sprint 3: Guided Plan Wizards. Build interactive workflows for:
>
> 1. Retire Earlier/Later slider:
>
> - Shift Retirement and Social Security Start events dynamically
> - Use 2026 Social Security formulas
> - Enforce $24,480 earnings limit for early retirees
>
> 2. Buy a Home wizard:
>
> - Inputs: purchase price, down payment
> - Auto-create Property asset, Mortgage debt, and Basic recurring monthly expense
>
> 3. Change Life Expectancy tool:
>
> - Move Mortality event
> - Show how long portfolio remains Blue before Red shortfall
>
> 4. Windfall event:
>
> - One-off inflow (e.g., inheritance)
> - Apply liquidation & sweep logic: pay down debts (e.g., mortgage) before investing surplus

### Acceptance criteria

- Wizard actions are reversible and auditable as timeline events.
- Retire slider updates both cash-flow and Social Security timing effects in real time.
- Windfall sweep follows debt-priority policy before investment allocation.

---

## Sprint 4 — Analytical Insights (Stress Testing)

### Goal

Deliver advanced scenario analytics with 1,000-iteration stochastic testing and optimization visuals.

### Claude prompt

> Finalize with Sprint 4: Analytical Insights. Build 1,000-iteration stress tests:
>
> 1. Monte Carlo simulation:
>
> - Randomize returns and inflation (2.5% baseline)
> - Output Visual Fan Chart and Confidence Age score
>
> 2. Roth conversion optimizer:
>
> - Detect low-tax years
> - Simulate 401(k)-to-Roth conversions to reduce long-term RMD leakage
>
> 3. Estate tax visualizer:
>
> - Use expanded exclusion: $15M individual / $30M joint
> - Show projected legacy retained by heirs
>
> 4. Net worth waterfall:
>
> - Animate flow: earnings -> spending -> legacy
> - Use Sankey-style structure

### Acceptance criteria

- Monte Carlo produces stable percentile bands over 1,000 iterations.
- Confidence Age metric is explainable and reproducible from simulation outputs.
- Waterfall/Sankey visualization matches ledger-level inflow/outflow totals.

---

## Suggested execution protocol for Claude

1. Restate sprint scope and list only the files/modules to touch.
2. Implement schema/types first, then pure calc functions, then UI bindings.
3. Add tests before wiring charts where feasible.
4. Provide a short changelog + known assumptions at sprint end.
5. Stop and request confirmation before entering next sprint.
