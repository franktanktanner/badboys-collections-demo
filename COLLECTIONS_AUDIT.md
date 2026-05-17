# Collections Command Center — Technical Audit

**Repo:** `badboys-collections-demo`
**Branch reviewed:** `productization-sprint-1`
**Reviewer:** Read-only audit, no code changes
**Purpose:** Strategic upgrade planning ahead of Wednesday demo to Bad Boys Bail Bonds

---

## SECTION 1 — Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Vite 8 + React 19.2** (SPA, no SSR) | `src/main.tsx` mounts `<App />` into `#root`. No router — tabs are local `useState`. |
| Language | **TypeScript ~6.0**, strict | Single `tsconfig` project ref, app + node configs. |
| Styling | **Tailwind CSS 3.4** with extended theme | Custom palette (bg/border/brand/status), custom shadows, gradient backgrounds. Component-layer classes in `src/index.css` (`.glass-card`, `.btn-*`, `.input`, `.label`, `.h-display`). |
| CSS extras | `clsx` + `tailwind-merge` via `src/lib/cn.ts` | Standard `cn()` helper. |
| Animation | **Framer Motion 12.38** | `motion.*` everywhere; `AnimatePresence` for tab transitions and the accounts row expansion. Used heavily — see Section 4. |
| Charts | **Recharts 3.8** | `MiniSparkline` (Area/Line), Reports tab uses `BarChart`, `PieChart`. Tooltip is restyled globally in `src/index.css`. |
| Icons | **lucide-react 1.8** | Roughly 25 unique icons. |
| State | `useState` only (component-local) | No Zustand, Redux, Context, Jotai. Selected location lifted to `App.tsx` and passed down by prop. |
| Data | **Static TS modules** (no API, no fetch, no Supabase). `accountFixtures.ts` (hand-crafted 8 accounts, 723 LOC) + `mockActivity.ts` (41 events) + `mockTranscripts.ts` (12 turns). All deterministic; no randomness at render time. |
| Build | `tsc -b && vite build`, deploys to **Vercel** (`.vercel/` present). | Static SPA. |
| Fonts | Google Fonts: IBM Plex Sans/Mono + Space Grotesk | Loaded in `index.html` head; `body { font-family: 'IBM Plex Sans', ...; }`. |
| Dead code | `src/data/mockAccounts.ts` (194 LOC) is **unreferenced** | Only `accountFixtures.ts` is actually wired into the UI. |

---

## SECTION 2 — Repository Structure

```
src/
├── main.tsx                                   10
├── App.tsx                                    46
├── index.css                                  82
│
├── config/
│   └── agencyConfig.ts                       102   ← multi-tenant scaffold (one tenant filled in)
│
├── pages/
│   ├── CommandCenter.tsx                     105
│   ├── Accounts.tsx                           40
│   ├── Automation.tsx                         25
│   └── Reports.tsx                           619   ← biggest single file by far
│
├── components/
│   ├── Layout/
│   │   ├── TopNav.tsx                        129
│   │   └── TabNav.tsx                         46
│   ├── Dashboard/
│   │   ├── KPICard.tsx                        76
│   │   ├── RecoveryPipeline.tsx               54
│   │   ├── ActivityFeed.tsx                   87
│   │   ├── OfficeGrid.tsx                     87
│   │   └── AutomationStats.tsx                55
│   ├── Accounts/
│   │   ├── SearchFilters.tsx                  80
│   │   ├── AccountsTable.tsx                 138
│   │   └── AccountDetail.tsx                 277
│   ├── Automation/
│   │   ├── AgentConfig.tsx                    87
│   │   ├── EscalationTimeline.tsx             51
│   │   └── CallTranscript.tsx                 86
│   └── shared/
│       ├── KPICard helpers via:
│       ├── CountUp.tsx                        51
│       ├── MiniChart.tsx                      55
│       ├── RiskMeter.tsx                      30
│       └── StatusBadge.tsx                    23
│
├── data/
│   ├── accountFixtures.ts                    723   ← 8 hand-crafted accounts, deep schema
│   ├── mockAccounts.ts                       194   ← UNUSED; procedural 28-account generator
│   ├── mockActivity.ts                        72   ← 41 events + KPI sparkline series
│   └── mockTranscripts.ts                     29   ← 12-turn AI call dialog
│
├── lib/
│   ├── cn.ts                                   6
│   ├── format.ts                              59
│   ├── filters.ts                            177
│   ├── recoverySelectors.ts                  142
│   └── recoveryActions.ts                     56
│
└── types/
    └── index.ts                              369   ← rich domain model, more than UI uses
```

**Total source:** ~4,268 LOC. Reports.tsx alone is 619 — it's where churn concentrates.

---

## SECTION 3 — Tab Inventory

### Tab 1 — Command Center (`src/pages/CommandCenter.tsx`)

**Composition (top to bottom):**

1. Optional `LocationBanner` (only when a single office is selected)
2. **4 KPI cards** in a `grid-cols-4` (Total Receivables, Collection Rate, AI Actions Today, Recovered)
3. **Recovery Pipeline** (left, 2/3 width) + **Live Activity** (right, 1/3 width)
4. **Office Grid** (full width, 6 office cards)
5. **AI Automation · 30 Days** (6-stat strip)

**Data:** All derived from `accountFixtures` via selectors in `lib/recoverySelectors.ts` and `lib/filters.ts`. Static — no API.

**Interactions:** Location dropdown (top-nav) filters every panel. OfficeGrid has a sort toggle (`Outstanding` / `Collection Rate`). Office cards are styled clickable but **clicking does not change selection** — only the top-nav dropdown sets the office. KPI cards animate on mount only.

**Status:** Most polished tab. This is the demo headliner.

### Tab 2 — Accounts (`src/pages/Accounts.tsx`)

**Composition:**

1. Optional `LocationBanner`
2. `SearchFilters` (search input, status pill bar, sort dropdown, Send SMS / Queue Call / Export buttons)
3. `AccountsTable` — single table over all 8 fixtures

**Data:** Only **8 hand-crafted accounts** (`accountFixtures`). Footer reads `Showing 8 of 8 accounts`. With status filters applied this can collapse to 1–2 rows or the empty state.

**Interactions:** Click a row → animated accordion expand showing `AccountDetail` (defendant + indemnitor + payment history + compliance flags + comms timeline + 8 action buttons). Action buttons validate compliance flags and log a local event; nothing leaves the browser.

**Status:** Detail panel is the deepest single feature in the app (277 LOC of layout, real compliance/consent logic in `lib/recoveryActions.ts`). The table itself feels under-populated (8 rows) and the Send SMS / Queue Call / Export buttons are **inert**.

### Tab 3 — AI Automation (`src/pages/Automation.tsx`)

**Composition:**

1. `AgentConfig` (left, 3/5 width) — 7 feature cards with **functional** toggle switches that persist in local state.
2. `EscalationTimeline` (right, 2/5 width) — 6-stage vertical workflow with colored gradient pills, gradient connector line.
3. `CallTranscript` (full width below) — header summary row + 12-turn chat-style transcript with AI/customer bubbles.

**Data:** All static. `callTranscript`/`callSummary` from `mockTranscripts.ts`. No state between toggles and other tabs.

**Interactions:** Toggles work (Framer `layout` animation on the switch knob). Transcript bubbles animate in via `whileInView` on scroll. **No playback.** No way to pause, restart, or rewind the call.

**Status:** Visually rich but largely passive. The transcript is the centerpiece and it's a static list.

### Tab 4 — Reports (`src/pages/Reports.tsx`)

**Composition:**

1. Optional `LocationBanner`
2. Page header + date-range dropdown (Last 30d / Last Quarter / YTD / Custom) + CSV/PDF buttons (inert)
3. **4 KPI tiles** (Collection Rate, Total Recovered, Avg Days to Recovery, Active Payment Plans) — variant of the Command Center KPI card without sparkline.
4. **Monthly Recovery** bar chart (12 bars, Recharts) + **AI vs Manual** donut chart
5. **Collections by Office** horizontal bars (6 offices) — full width
6. **Top Recovered Accounts** table + **Outstanding by Age** vertical aging buckets

**Data:** Mixed. Some real selectors (`getOfficeRecoveryStats`, `getAccountRecoveredAmount`). Other values multiplied by `RANGE_MULTIPLIERS` lookup table to fake the date-range effect:

```ts
const RANGE_MULTIPLIERS: Record<DateRange, number> = {
  'Last 30 days': 0.18,
  'Last Quarter': 0.52,
  'YTD': 1,
  'Custom': 0.74,
};
```

AI vs Manual split is hardcoded at 87/13 (`const aiShare = 0.87`).

**Interactions:** Date range dropdown re-runs `useMemo` chains and re-animates the bars. CSV/PDF are decorative.

**Status:** Newest tab (commit `3012765` "Remove Attorney Pipeline, add Reports tab"). Solid for screenshots; thin on actual differentiation. Donut + bar combo reads as a generic SaaS report template. **Weakest tab strategically** — feels added under deadline pressure.

---

## SECTION 4 — Animation Inventory

| Where | What | Trigger | Status |
|---|---|---|---|
| `App.tsx:22-35` | Tab content fade + 8px vertical slide | Tab change (`AnimatePresence mode="wait"`) | ✅ Works |
| `TabNav.tsx:33-39` | Gold underline slides between active tabs (`layoutId="tab-underline"`, spring) | Tab change | ✅ Works |
| `TopNav.tsx:113-116` + `ActivityFeed.tsx:34-37` | "AI Agent Active" ping pulse + "Live" pulse (custom `ping-slow` in `tailwind.config.js`) | Always on (CSS keyframes) | ✅ Works |
| `KPICard.tsx:44-48` | Card fade + 16px rise, staggered via explicit `delay` (0, 0.08, 0.16, 0.24) | On mount only | ✅ Works |
| `CountUp.tsx` | Number counts up from 0 with cubic-ease over 1400ms | On scroll into view (`useInView`, `once: true`) | ✅ Works — used in KPI cards, Reports tiles, AutomationStats |
| `MiniChart.tsx:35-37` | Recharts `isAnimationActive` area draw, 900ms | On mount | ✅ Works |
| `RecoveryPipeline.tsx:40-46` | Horizontal bar grows from 0 → width%, staggered per stage. **Re-keys on location change** (`key={`${location}-${s.label}`}`) | On mount + on location change | ✅ Works (re-animates when filtering by office) |
| `ActivityFeed.tsx:55-60` | Each item fade + 12px slide-in-from-left, stagger capped at 0.4s total | On mount only | ⚠️ **NOT live** — runs once, then static |
| `OfficeGrid.tsx:44-48` | Card fade + 12px rise, 25ms stagger | On mount | ✅ Works |
| `AutomationStats.tsx:35-39` | Tile fade + 10px rise, 50ms stagger | On mount | ✅ Works |
| `EscalationTimeline.tsx:25-30` | Step fade + 12px slide-from-left, 120ms stagger | `whileInView`, once | ✅ Works |
| `CallTranscript.tsx:40-46` | Each bubble fade + 6px rise, 80ms stagger | `whileInView`, once | ⚠️ **Not conversational** — all turns drop in immediately on scroll |
| `AccountsTable.tsx:68-72` | Row fade + 6px rise, 15ms stagger | On mount | ✅ Works |
| `AccountsTable.tsx:114-123` | Row expansion accordion (`AccountDetail`) — height 0→auto + opacity | On row click | ✅ Works |
| `AgentConfig.tsx:71-78` | Toggle knob slides L↔R with spring (`layout`) | On click | ✅ Works |
| `RiskMeter.tsx:20-25` | Risk score bar grows from 0 → score% | On mount | ✅ Works |
| `Reports.tsx` bars/charts | Recharts animates on render; office bars re-key by `${office}-${recovered}` | On date-range change | ✅ Works |

**Direct answers to your callouts:**

- **Live Activity feed:** No. It is a static pre-sorted list with `relativeTime()` rendered on each mount. Items animate **once** as they fade in (left slide, 40ms stagger). There is no `setInterval`, no websocket, no shift of items down. Timestamps say "2m ago" because `mockActivity.ts` builds ISO strings using `ago(2)` at module load and `relativeTime` is recomputed only on re-render. So the feed will silently get more stale the longer the tab is open until the user changes filter/tab.
- **AI Call Transcript:** No typing animation. All 12 turns are rendered immediately; they fade/rise in scroll-triggered with 80ms stagger and then sit static. No autoplay, no audio waveform, no "agent is typing" indicator.
- **KPI numbers count up:** ✅ Yes, via `CountUp` (cubic ease, 1400ms, fires once when scrolled into view). Works in CommandCenter KPI cards, Reports KPI tiles, AutomationStats tiles.
- **Sparklines:** Animated. Recharts `isAnimationActive` with 900ms area draw on first paint.
- **Recovery Pipeline bars:** Animated. Width grows from 0 with 900ms ease, staggered per stage. **And** they re-animate when the location filter changes (the `key` includes `location`).

---

## SECTION 5 — Data Layer

### Where it lives

| File | Lines | Purpose |
|---|---|---|
| `src/data/accountFixtures.ts` | 723 | **8 deeply hand-crafted accounts** with full payment history, communications, compliance flags, promises-to-pay, payment plans, and human handoffs. This is the source of truth for the Accounts table, the Recovery Pipeline counts, OfficeGrid totals, Reports KPIs. |
| `src/data/mockActivity.ts` | 72 | 41 activity events for the Live Activity feed; KPI sparkline series (`kpiTrend`, `outstandingTrend`, `recoveredTrend`, `aiActionsTrend`). |
| `src/data/mockTranscripts.ts` | 29 | 12-turn AI ↔ customer call dialog + `callSummary` metadata. |
| `src/data/mockAccounts.ts` | 194 | **Dead code.** Procedural 28-account generator with seeded RNG. Not imported anywhere. |
| `src/config/agencyConfig.ts` | 102 | The tenant config (Bad Boys Bail Bonds: name, slogan, branding colors, 6 offices). Drives labels, office list, and filter dropdown options. Multi-tenant scaffolding clearly in place. |

### Schemas (real)

**Account** (`src/types/index.ts:34`) — the central type. Required: `id`, `bondId`, `defendant{}`, `indemnitor{}`, `bondAmount`, `amountOwed`, `daysPastDue`, `riskScore`, `status`, `office`, `lastContact`, `nextAction`, `payments[]`, `communications[]`. Optional rich layer: `compliance` (10 boolean flags + consent + contact window), `outreachEvents[]`, `promisesToPay[]`, `paymentPlans[]`, `handoffs[]`, `recoveryActions[]`. The fixtures use the rich layer; the dashboard surface only renders ~40% of those fields.

**Activity** — `{ id, timestamp, type, title, description, outcome?, amount?, office? }` where `type` is one of 8 `ActivityType`s.

**TranscriptTurn** — `{ speaker: 'AI' | 'Customer', timestamp: string (mm:ss), text: string }`.

**KPI series** — plain arrays of `{ value, ... }` produced by deterministic formulas, e.g.:
```ts
export const kpiTrend = Array.from({ length: 30 }, (_, i) => ({
  day: i,
  value: 1.2 + i * 0.25 + Math.sin(i / 3) * 0.4 + (i > 20 ? (i - 20) * 0.15 : 0),
}));
```

### Extensibility

- **Adding accounts:** Easy mechanically — append a `buildAccount({...})` block to `accountFixtures.ts`. Each block is ~80 lines of hand-typed JSON-shaped TS. Painful at scale; no generator. The dead `mockAccounts.ts` proves a generator was tried and abandoned.
- **Adding event types:** `ActivityType` union in `types/index.ts` must be extended, plus an entry in `ActivityFeed.tsx`'s `ICONS` map. ~5-minute change.
- **Live feed simulation:** Would require an interval + state in `ActivityFeed.tsx`. Trivial wire-up; data is already structured for it.
- **Adding offices:** Add to `agencyConfig.offices` + retag fixtures to the new office. Filters/KPIs auto-recompute.

### Determinism

Everything is deterministic. No `Math.random()` at render time. The only "live" feel comes from `relativeTime(new Date())` recomputing relative timestamps each render — but the underlying ISO strings are frozen at module load. Open the tab at 9am and the "2m ago" event will say "3h ago" by noon. This is a foot-gun for a 23-minute demo only if you reload the page mid-demo.

---

## SECTION 6 — Visual Design Audit

### Card styling (`.glass-card` in `src/index.css:35-39`)

```css
.glass-card {
  @apply relative rounded-xl border border-border bg-bg-surface/60 backdrop-blur-xl shadow-card;
}
```

- **border-radius:** `rounded-xl` = **12px**
- **padding:** Mixed — `p-4`, `p-5`, `p-6` depending on component. Inconsistent.
- **border:** `rgba(148, 163, 184, 0.14)` (subtle steel-blue, ~14% opacity). On hover, `.glass-card-hover` bumps to `0.24`.
- **background:** `#0B1220` at 60% opacity over a deep navy base, with backdrop-blur-xl (heavy frost effect)
- **shadow:** Custom `shadow-card`: `0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 40px -20px rgba(0,0,0,0.6)` — a top inner hairline + a soft dropshadow. Premium-leaning.

### Color palette (`tailwind.config.js`)

| Token | Hex | Where used |
|---|---|---|
| `bg.base` | `#020617` | Page background |
| `bg.surface` | `#0B1220` | Glass cards |
| `bg.elevated` | `#111a2e` | Inner card panels, hover bg |
| `bg.raised` | `#16213d` | Switch off-state |
| `brand.gold` | `#EAB308` | Primary accent — KPI numbers, active tab, "AI Active" pulse, primary buttons. Heaviest brand color. |
| `brand.goldlight` | `#FACC15` | Brighter gold (highlights, selected text) |
| `brand.golddark` | `#CA8A04` | Gradient end, monthly bar low |
| `brand.red` / `redlight` | `#DC2626` / `#EF4444` | Declared but barely used. Bad Boys' actual brand is red, so this is **underleveraged**. |
| `status.active` | `#22C55E` | Active accounts, cleared payments, success badges |
| `status.delinquent` | `#F59E0B` | Amber warning |
| `status.escalated` | `#EF4444` | Red |
| `status.legal` | `#A855F7` | Purple |
| `status.plan` | `#3B82F6` | Blue (payment plan, AI call icon) |

Background gradient blobs in `index.css` add gold/blue/green radial washes at body level — a Stripe/Linear pattern.

### Typography hierarchy

| Element | Class | Computed |
|---|---|---|
| Page H1 (Reports) | `h-display text-xl` | Space Grotesk 600, **20px** |
| Card titles | `h-display text-lg` | Space Grotesk 600, **18px** |
| KPI numbers | `font-display text-3xl ... lg:text-[32px]` | Space Grotesk 600, **30–32px** |
| Body | default | IBM Plex Sans 400, **14px** (`text-sm`) |
| Sub/desc | `text-xs text-slate-400` | **12px** |
| Labels (uppercase) | `.label` → `text-[11px] uppercase tracking-[0.14em] text-slate-500` | **11px**, wide tracking |
| Timestamps / IDs | `font-mono text-[10px]–text-xs` | IBM Plex Mono |
| Tabular numerics | `tabular-nums` applied to all $ figures | ✅ good |

Hierarchy is correct but conservative. KPI numbers should probably be louder (40–48px) for a TV-screen demo. Card titles all at the same `text-lg` makes everything feel level.

### Spacing system

Tailwind defaults throughout (`gap-2`, `gap-3`, `gap-4`, `space-y-3`, `p-4`, `p-5`, `p-6`). No custom scale. The lack of strictness shows: KPI cards are `p-5`, glass-cards on other panels are `p-6`, search filters are `p-4`. Not catastrophic, but the eye picks it up.

### Hover states (where they exist)

- `.glass-card-hover` — border lightens, bg opacity 60→80
- KPI cards: hover bumps border (subtle)
- Office cards: border → gold/30, bg-elevated/80 (clear feedback)
- Table rows: bg-elevated/40 on hover
- Buttons: explicit hover bg shift, primary scales 0.98 on active
- Toggle switches: spring on layout change

**Missing hover affordances:** No tooltips on KPI numbers. No "click for detail" cursor cues on KPI cards (they look clickable; they aren't). Office cards look clickable but only the top-nav dropdown changes selection.

### Empty/sparse states

- Activity feed has a real empty state (dashed border, "No recent activity for this office") — appears when filtering to an office with no events.
- Accounts table empty state ("No accounts match your filters.").
- **Reports tab** has empty states on Top Recovered table only. The donut chart will render two slices even at low totals, which can look bad.
- **The biggest sparseness:** Accounts table only has 8 rows. Filter by status + office and you can get to 0–2. The footer literally reads "Showing 8 of 8 accounts" — a $47K client will notice.

---

## SECTION 7 — Component Breakdown (Command Center focus)

### 1. `KPICard.tsx` (76 LOC) — `src/components/Dashboard/KPICard.tsx`

- **Renders:** Glass card with label, optional trend pill (up/down arrow + %), large display number, sub-text, and a 48px sparkline.
- **Props:** `label`, `value`, `format` ('currency'|'currency-compact'|'number'|'percent'), `sub`, `trendValue?`, `trendDirection?`, `trendGood?`, `chartData`, `chartColor?`, `accent` ('gold'|'green'|'blue'|'red'), `delay?`.
- **State:** None. Pure.
- **Notable:** Accent drives both the gradient overlay (`ACCENT_GRADIENTS`) and the sparkline stroke (`ACCENT_COLORS`). Animations fire on mount with explicit `delay` for waterfall effect.
- **Debt:** `accent='red'` is declared but unused. The trend pill has subtle color logic (`isGood = trendDirection === trendGood`) but the calling code at CommandCenter.tsx:29 hardcodes `'up'` when not filtered — meaning **the green "outstanding trend" arrow is fake in the all-locations view**.

### 2. `RecoveryPipeline.tsx` (54 LOC)

- **Renders:** Card with 5 stage rows (Active / Delinquent / Escalated / Legal / Write-off), each with a label, count, $ amount, and animated horizontal bar.
- **Props:** `location: LocationFilter`.
- **State:** None.
- **Notable:** Bars are width-percentaged against `max(amount)`, not against the total — which means the longest bar always reaches 100% and the others are relative. That's the visually correct choice for a "stage scale" view. Re-keys by `${location}-${s.label}` so bars re-animate on filter change. Write-off is hardcoded to 0 (`stage.label === 'Write-off' ? 0 : ...`).

### 3. `ActivityFeed.tsx` (87 LOC)

- **Renders:** Glass card with "Live" pulse chip, scrollable list of activity items. Each item has a circular icon (color-coded by `ActivityType`), title, description, relative timestamp, optional $ amount + outcome + office. Vertical timeline line behind icons.
- **Props:** `location: LocationFilter`.
- **State:** None. Sources `mockActivity` and filters by office.
- **Debt:** **The single biggest "looks live but isn't" component in the app.** Capped at `max-h-[560px]` (twice the same class — typo at line 25). No interval, no setState, no rotation. The chip says "Live" with an animated dot but nothing in the data actually changes.

### 4. `OfficeGrid.tsx` (87 LOC)

- **Renders:** Sortable 6-tile grid (1→4 columns responsive). Each tile: office name, trend arrow, big $ figure, account count, collection %.
- **Props:** `location: LocationFilter`.
- **State:** `sort` (`'amount' | 'rate'`).
- **Notable:** Visually clean — gold ring + check icon on the currently selected office. **But clicking a tile does not select the office**; the only way to filter is via the top-nav dropdown. The cursor changes to pointer (`cursor-pointer`), which is misleading.

### 5. `AutomationStats.tsx` (55 LOC)

- **Renders:** 6-tile strip (Calls / SMS / Emails / Payments / Plans / Skip Traces), each with icon + count + sub-line.
- **Props:** `location: LocationFilter`.
- **State:** None.
- **Notable:** Counts come from `getAutomationStats(location)` which reads `outreachEvents` synthesized from `communications` in the fixture builder (`accountFixtures.ts:125-147`). The sub-lines ("avg 4.2 min call duration", "22% response rate", etc.) are **hardcoded strings** — they don't react to data or location.

### 6. `CallTranscript.tsx` (86 LOC)

- **Renders:** Header (avatar + bond ID + customer + "Payment plan accepted" chip), 4-cell summary row (Duration / Recovered / Plan / Sentiment), then 12 chat bubbles alternating left (AI, gold-tinted) / right (customer, slate). AI bubbles get a yellow border tint.
- **Props:** None — reads `callTranscript` and `callSummary` directly.
- **State:** None.
- **Debt:** The bubble layout is excellent — but presented as a static dump. This is the single biggest "we built a real AI" moment in the demo and it's wasted on a list. See Section 9.

### 7. `AccountDetail.tsx` (277 LOC) — Accounts tab, but worth noting

- **Renders:** Three-column layout (Defendant+Indemnitor, Payment History+Compliance flags, Comms log+Action grid). 8 action buttons (AI Call, SMS, Email, Payment Plan, Promise-to-Pay, Escalate, Skip Trace, Human Review) each validated against the account's compliance flags via `validateRecoveryAction()`.
- **Props:** `{ account: Account }`.
- **State:** `localEvents` (last 4 action attempts), `actionMessage`.
- **Notable:** This is the most "real" piece of the app. The validation logic (`recoveryActions.ts`) is real code — clicking SMS on a DNC account returns "Blocked: do-not-contact is active." with a tooltip. The "Local Action Log" panel even renders properly. **Strong demo moment** — and underused, since you have to expand a row to see it.

---

## SECTION 8 — What's Missing / Weak Points

### The "looks live, isn't" gap
The product positioning is "Bail Bond Recovery OS" with a pulsing "AI Agent Active" indicator. Yet:
- The Live Activity feed is a static list.
- The Call Transcript doesn't play.
- KPI numbers don't tick forward after the initial CountUp.
- No "X events in last hour" rolling counter.

For an in-person demo this is the **first thing a tech-savvy buyer would notice**. For the bail bonds owners, the absence of a single visible "thing ticking" undercuts the premium positioning.

### Accounts tab data thinness
8 hand-crafted accounts is too few for a real "manage your book" feel. Filter to "Escalated" + "San Diego" and the table can collapse to a single row. The dead `mockAccounts.ts` (28 procedurally generated) suggests someone planned to scale this up and abandoned it.

### Inert primary buttons
- Search filters bar: "Send SMS", "Queue Call", "Export" — all inert.
- Reports tab: "CSV", "PDF" — inert.
- Account row actions work; bulk actions do not.
A non-technical client probably won't click; a technical one will.

### Reports tab feels like a template
The bar/donut/horizontal-bar combo (`MonthlyRecoveryCard`, `AiManualCard`, `OfficeCollectionsCard`) is what every analytics SaaS ships. There's nothing differentiated here. The hardcoded `aiShare = 0.87` is the marketing message ("87% of dollars are recovered by AI") but it's not visually amplified — it's just one slice of a donut.

### Brand under-leveraged
- `brand.red` and `brand.redlight` are declared but barely used. Bad Boys' actual logo is red. Right now the dashboard reads as "generic gold-on-dark SaaS." A single red accent stripe or red KPI for outstanding dollars would tie to their identity.
- Slogan "Because Your Mama Wants You Home!" appears only in the **footer** at 11px. That's a brand asset — should be in the empty states or splash.

### Visual hierarchy issues
- All section titles are `text-lg` (18px). KPI numbers are 30–32px. The jump is too small — KPI numbers should dominate.
- Three different card paddings (`p-4`, `p-5`, `p-6`) across the app — looks accidental, not intentional.
- The radial gradient blobs in the body background are subtle to the point of disappearing on lower-contrast monitors.

### Tab inconsistency
- Command Center uses card-gradient overlays per KPI accent.
- Reports uses the same KPI card without the sparkline.
- Automation tab is the only tab with `space-y-6` instead of `space-y-4`.
These are 30-minute fixes but they're "rushed sprint" tells to a senior reviewer.

### Real code-quality nits
- `ActivityFeed.tsx:25` — `max-h-[560px] flex-col p-6 xl:max-h-[560px]` (duplicate class).
- `CommandCenter.tsx:29` — `trendDirection={filtered ? (kpis.outstandingTrend > 0 ? 'up' : 'down') : 'up'}` — the "all locations" branch ignores actual trend sign.
- `mockAccounts.ts` is dead code (194 LOC).
- `recoveryStatus`, `priority`, `assignedUserId`, `handoffs[]`, `promisesToPay[]` exist on `Account` and in fixtures but **render nowhere in the UI** — the domain model is richer than the surface.
- The `agencyConfig` is multi-tenant scaffolded but only `'agency-bad-boys'` exists — fine for a demo, but the conditional fallbacks (`?? account.amountOwed`) suggest someone half-migrated from the old shape and stopped.

---

## SECTION 9 — Upgrade Opportunities (ranked by impact-per-effort)

### 1. Make the Live Activity feed actually live ⚡
- **What:** Add a `setInterval` (every 6–10s) that prepends a new activity item from a pool, slides existing items down via Framer `<AnimatePresence>` with `layout`, and trims to the last 20.
- **Effort:** ~2 hours. Pool already exists (41 events in `mockActivity.ts` — recycle them).
- **Impact:** **High.** This is the headline change. The chip already says "Live" — make it true.
- **Files:** `src/components/Dashboard/ActivityFeed.tsx`, `src/data/mockActivity.ts` (add a "live pool" array).
- **Dependencies:** None.

### 2. Conversational playback of the AI Call Transcript ⚡
- **What:** Add a "Play call" button. When pressed, render bubbles one at a time with a 1-char-per-30ms typing animation. Show a "AI is typing…" indicator between turns. Autoplay on tab focus (with a "Replay" button after).
- **Effort:** ~3–4 hours.
- **Impact:** **High.** This is the single most impressive thing in the demo — the proof that "we built an AI agent that can negotiate payment plans." Right now it's wasted on a static dump.
- **Files:** `src/components/Automation/CallTranscript.tsx`.
- **Dependencies:** None (Framer Motion handles it).

### 3. Sharpen the card system (denser, more "console" feel) 🎨
- **What:** Reduce `rounded-xl` (12px) → `rounded-lg` (8px) on glass cards. Add a 2px left accent border in `brand.red` (`#DC2626`) to the top 2 KPI cards (Outstanding, Recovered) to tie back to Bad Boys' actual brand color. Standardize all glass-cards to `p-5`. Bump KPI numbers from `text-3xl/[32px]` to `text-4xl/[40px]` — they need to dominate.
- **Effort:** ~2 hours (touch 6–8 files).
- **Impact:** **Medium–High.** Across-the-board "premium" upgrade.
- **Files:** `src/index.css` (.glass-card), `KPICard.tsx`, all five Dashboard components, both pages with cards.
- **Dependencies:** None.

### 4. Scale the Accounts table to 40–60 rows 📊
- **What:** Use the existing `mockAccounts.ts` generator (already written, already deterministic). Either delete `accountFixtures.ts` and pivot UI to read 40 mid-detail accounts, OR keep the 8 hand-crafted + procedurally extend with 32 lighter records. The 8 fixtures should still bubble to the top.
- **Effort:** ~2 hours (rewire imports + ensure compliance/payments shape matches).
- **Impact:** **High.** "Showing 8 of 8 accounts" → "Showing 47 of 47 accounts" is a credibility win for a multi-office bail bond company.
- **Files:** `src/data/accountFixtures.ts` (extend or merge), `src/data/mockAccounts.ts` (revive), `src/components/Accounts/AccountsTable.tsx` (no logic change).
- **Dependencies:** None.

### 5. Make Office tiles click-to-filter 🖱️
- **What:** Wire `OfficeGrid` tile clicks to `onLocationChange`. Right now the cursor lies. Two-line change, lifts a lot of "you can drill in" feel.
- **Effort:** ~30 min.
- **Impact:** **Medium.** Discoverable, fixes a visible UX lie.
- **Files:** `src/components/Dashboard/OfficeGrid.tsx`, `src/pages/CommandCenter.tsx` (pass setter), `src/App.tsx`.
- **Dependencies:** None.

### 6. Wire up Send SMS / Queue Call / Export buttons (decorative-functional) 📨
- **What:** Make Send SMS / Queue Call open a small modal with the selected count, a fake textarea, and a "Schedule" button that flashes a green confirmation toast. Make Export download an actual `accounts.csv` from the in-memory fixture list (5-line Blob).
- **Effort:** ~2 hours total.
- **Impact:** **Medium.** Removes the "everything is decoration" smell.
- **Files:** `src/components/Accounts/SearchFilters.tsx`, new `src/components/shared/Toast.tsx`.
- **Dependencies:** None.

### 7. KPI ticker / "rolling number" mode 📈
- **What:** After the initial CountUp finishes, set up a slow drift (one of the KPIs nudges up by a small random amount every 8s — Recovered $ is the natural one). Even +$420 every few seconds reads as "the AI is working right now."
- **Effort:** ~1 hour.
- **Impact:** **Medium–High** for the demo, **Low** outside it.
- **Files:** `src/components/Dashboard/KPICard.tsx` (optional `tick` prop), `src/pages/CommandCenter.tsx`.
- **Dependencies:** None.

### 8. Brand the empty/idle states 🎨
- **What:** Use the slogan "Because Your Mama Wants You Home!" in empty states and at the top of the Automation tab. Add a single subtle red accent (logo monogram or a 1px red dividing line) somewhere prominent.
- **Effort:** ~1 hour.
- **Impact:** **Medium.** Makes the dashboard feel made-for-them, not template-with-name-swapped.
- **Files:** `src/components/Layout/TopNav.tsx`, `src/components/Dashboard/ActivityFeed.tsx`, `src/pages/Automation.tsx`.

### 9. Reports — replace donut with something distinctive 📊
- **What:** The AI vs Manual donut is the weakest part of Reports. Replace with a **big animated stat** — "$1.2M of $1.4M recovered by AI" with a wide horizontal stacked bar (gold AI segment dominating) and a "vs $180K by your team" callout. The story is "the AI did the work" — show that, don't pie-chart it.
- **Effort:** ~2 hours.
- **Impact:** **Medium.** Differentiates the most generic part of Reports.
- **Files:** `src/pages/Reports.tsx` (replace `AiManualCard`).

### 10. Add a global "Today" pulse 🌐
- **What:** Sticky bottom-left toast that periodically (every 20s) flashes a single one-liner from the activity pool: "AI just collected $4,100 from Yuki Nakamura · Redwood City". 2-second fade in/out.
- **Effort:** ~2 hours.
- **Impact:** **High** for the demo (constant ambient "the AI is doing things"), **Low** for production. Cleanly toggleable.
- **Files:** New `src/components/Layout/GlobalPulse.tsx`, `src/App.tsx`.

### 11. Remove dead code & tighten domain model 🧹
- **What:** Delete `src/data/mockAccounts.ts`. Surface 2–3 of the unused but rich account fields in `AccountDetail` (priority badge, recoveryStatus, handoff state).
- **Effort:** ~1 hour.
- **Impact:** **Low–Medium.** Demo-invisible but tightens a senior code-reviewer's impression.
- **Files:** Delete `src/data/mockAccounts.ts`, `src/components/Accounts/AccountDetail.tsx`.

### 12. Pre-built "demo script" toggle 🎬
- **What:** Add a hidden `?demo=1` query-string mode that enables (a) the live activity feed, (b) the rolling KPIs, (c) the global pulse, (d) auto-playing the call transcript on Automation-tab entry. One switch flips the whole dashboard into "presentation mode."
- **Effort:** ~1 hour (after items 1, 2, 7, 10).
- **Impact:** **Medium.** Makes Wednesday's demo controllable — no flickering at the wrong moment.
- **Files:** `src/App.tsx`, plus the components touched by items above.

---

## SECTION 10 — Demo Mode Suggestions

**Audience profile:** Bail bond agency owners, likely 50s–60s, non-technical. They process information from motion and color, not from labels. Three things will land: (1) numbers that move on their own, (2) one moment that proves a real AI is doing real work, (3) familiar bond-office language ("indemnitor", "skip trace", "BB-2024-1040").

### What should auto-animate on page load to wow them
On first render, in this order (this is what already happens):

1. **Tab content fades in + 8px rise** (Framer, 280ms) — sets the "this is a real product" tone.
2. **4 KPI cards stagger in** (50ms each), then **their numbers count up from $0** over 1.4s.
3. **Recovery Pipeline bars grow from left to right**, staggered.
4. **Live Activity items slide in from the left**, staggered.
5. **Office tiles fade up**, 25ms stagger.
6. **Sparklines draw themselves** under each KPI.

This already looks great. The single highest-value addition is **the activity feed continuing to add items every 7–10s** so the motion never stops (Upgrade #1).

### Interactions to trigger live during the demo

1. **Click the location dropdown → switch to "Los Angeles"** — every panel re-renders, the Pipeline bars re-animate, the Office grid highlights LA. **Strong "everything is connected" beat.**
2. **Open the Automation tab → walk to the bottom → CallTranscript** — read 2–3 of the bubbles aloud ("Hi, is this Rosa Reyes…"). The voice/tone of the AI is the differentiator. *(After Upgrade #2: hit the Play button instead and let it type itself out.)*
3. **Toggle a feature off in AgentConfig** — the gold switch spring is satisfying, and shows control.
4. **Open the Accounts tab → click any row → walk through Defendant/Indemnitor/Compliance flags/Payment History/Action grid** — this is your "we built real software" panel. Bondsmen know what "DNC", "C&D", and "represented by attorney" mean. Show them clicking SMS on a blocked account returns the right blocked reason.
5. **Sort the Office Grid by Collection Rate** — small button, big payoff (data re-sorts smoothly).
6. **Reports tab → toggle date range "Last Quarter" → "YTD"** — every bar re-grows from 0. This is a "the data is real" beat.

### Built-in "show off" moments you may not know about

- **The `RiskMeter` bars in the Accounts table** grow from 0 every time you expand or re-render — easy to miss but visually rich. Point them out.
- **The compliance flag grid in AccountDetail** is genuinely impressive (8 flags, color-coded, with DNC/C&D blocking actions in real-time). Most "demo dashboards" don't have this depth.
- **Pipeline bar re-animation on location filter** — the `key={location}` trick makes them visually punch every time you change office. Use it often.
- **The `tabular-nums` everywhere** — $ figures line up perfectly. Compare to any competitor dashboard where digits jiggle.
- **The footer slogan** — "Because Your Mama Wants You Home! · 1.800.BAIL.OUT" — point at it once for a smile.

### Single most impressive thing — your opening beat

**Lead with the Command Center landing animation, then immediately filter to one office.**

> "Let me show you the whole book." *[Page loads, numbers count up, bars grow]* "OK — $1.4M outstanding across 6 offices. Now watch what happens when I look at just LA…" *[Click LA in the dropdown]* *[Everything re-animates in 1 second]* "Every panel re-scopes. The AI is working those 12 LA accounts right now."

That sequence — auto-animation + your live filter trigger — takes 15 seconds and proves more than any spoken slide.

If you ship Upgrade #1 and #2 before Wednesday, your second beat is **"and the AI is still working while we talk"** (point at the Live Activity feed adding items), and your third is **"let me play you a call from this morning"** (click Play on the transcript and let it type itself out). That three-beat sequence — landing animation → live ambient motion → AI call playback — is your demo.

---

## Stack of changes I'd ship by Tuesday night

If you only do three things, in this order:

1. **Upgrade #1** — Live Activity feed actually live (~2 hr)
2. **Upgrade #2** — Call Transcript typing playback (~3 hr)
3. **Upgrade #4** — Scale Accounts table to 40+ rows (~2 hr)

That's ~7 hours of focused work. The first two convert "looks live" into "is live" — the single biggest perception gap. The third removes the only credibility-puncturing data point ("Showing 8 of 8 accounts"). Everything else in Section 9 is polish on top of an already-strong foundation.
