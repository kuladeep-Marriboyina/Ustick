# UStick — Project Overview

> **Make It Stick** — turn the questions you get wrong into topics you actually master.
> Team **UStick** · UWorld hackathon.

---

## 1. The problem

Students learn the most from the questions they get **wrong** — yet they keep repeating the same
mistakes. You miss a question, read the explanation, think *"oh right, of course"*, hit Next… and two
weeks later a different question tests the same idea and you miss it again.

- Mistakes vanish into a test report once you move on.
- The same weak concept, missed across three tests, lives in three different reports.
- "Renal: 58%" doesn't tell you *what* you keep getting wrong.

**Nothing keeps a student's mistakes in front of them until they are actually fixed.**

## 2. The idea

Every topic a student is weak on becomes a **card on their personal Wall**. A card can't be
dismissed — it only leaves the wall when the student **proves mastery** of that topic. Mastery isn't
a button you click; it's **earned by retesting** on the same concept, and because real memory needs
spacing, it's earned **over several days**, not in one sitting.

When a topic reaches 100% mastery it **auto-graduates** into the *Mastered* list — a growing record of
every topic the student has genuinely beaten.

## 3. Tech stack

| Layer | Tech |
|-------|------|
| Frontend | **Angular 11** (TypeScript, RxJS), SCSS, Inter font — "Minimal Light" design |
| Backend | **.NET 8** Web API, layered, **raw ADO.NET** (no EF/Dapper), Swagger |
| Database | **SQL Server** — one new `STICKY_NOTES` table; everything else reuses existing UWorld data |

Chosen to match UWorld's real conventions (pulled from the production `support.web` and `orders.api`
repos): Angular 11 + SCSS tokens, and a .NET Controllers → Services → Repositories layering over raw
ADO.NET.

## 4. Architecture

```
uwwebtech.uwweb.ustick.web/ClientApp         Angular 11 SPA
  src/app/
    core/            layout (sidebar + top bar), models (StickyNote, Strategy, stage helpers)
    features/
      wall/          The Wall board + topic-card (mastery ring) + retest dialog
      strategy/      spaced-repetition strategy settings panel
      create-test/   create-test screen (mirrors the UWorld create-test page)
    services/        StickyNoteService (facade: mock <-> API), ClockService (demo clock),
                     StrategyService, http + mock data (incl. per-topic question banks)

uwwebtech.uwweb.ustick.api                   .NET 8 Web API
  …api/              Controllers, Program/Startup, CompositionRoot (DI), exception middleware
  …application/      StickyNoteService (grouping, peel-party, scoring entry points)
  …infrastructure/   raw-ADO.NET StickyNoteRepository, Models, SeedData (DB-less fallback)

db/StickyNotes.sql                           the one new table + seed
```

Data flow: **Angular** → `StickyNoteService` (facade) → live **.NET API** or in-memory **mock**.
The API → `StickyNoteService` → `StickyNoteRepository` → **SQL Server** (or `SeedData` when no
connection string is set). Flip `useMock` in the facade to switch the whole app between mock and live.

## 5. Features

- **The Wall** — weak topics as clean cards in four stages: **Weak → Improving → Almost there →
  Mastered**, each with a **circular mastery ring**.
- **Retest to earn mastery** — tap *Retest* → a focused dialog serves **same-concept MCQs** for that
  exact topic → instant feedback + rationale → correct answers raise the live ring.
- **Mastery can't be cheesed** — gain per attempt is **capped** (~+20), weak attempts **drop** mastery,
  and crossing into 100% requires already being ≥ 85%. So a topic is never mastered in one attempt.
- **Spaced repetition** — after a retest the topic **locks for a cooldown** (e.g. 🔒 2d) and only
  returns when **due**. Reaching 100% therefore spans multiple days.
- **Configurable strategy** — the learner picks how spacing works: **Proven** (default — expanding
  `2·4·7·14`-day intervals, best for long-term memory), **Cram**, **Relaxed**, or **Custom**
  (edit intervals, strong-pass threshold, gain cap).
- **Auto-graduate** — at 100% the card leaves the wall, drops into **Mastered**, and a toast celebrates.
- **Demo time travel** — a **⏩ Simulate day** control advances the clock so the multi-day loop is
  visible immediately instead of waiting real days.
- **Create Test** — a faithful recreation of the UWorld create-test screen (collapsible cards,
  Standard/Custom pill, count badges, sticky GENERATE TEST footer).
- **Minimal-Light UI** — Linear/Vercel-style: white surfaces, one accent, airy spacing, soft shadows,
  mastery rings, strong-streak pips, subtle motion.

## 6. The mastery model (how a topic is beaten)

- Each topic has a **mastery** value `0–100` that drives its ring and stage (`stateForMastery`).
- A **retest** scores `correct / total`:
  - gain = `gainCap × accuracy − penalty × (1 − accuracy)` → a perfect attempt adds ~`gainCap`,
    a poor one subtracts.
  - mastery can reach 100 **only if it was already ≥ gradFloor (85)** before the attempt.
- A **strong pass** (accuracy ≥ `strongThreshold`) advances the **spaced schedule** and bumps a
  *strong-streak*; a weak pass resets the streak and the topic returns sooner.
- Cooldown after a strong pass expands with the streak (`strongIntervals`), enforcing spacing.

All constants live in the **strategy** the learner selects — see
`src/app/core/models/sticky-note.model.ts` (`STRATEGY_PRESETS`, `DEFAULT_STRATEGY`).

## 7. Data

**New table `STICKY_NOTES`** (one row per weak topic per student): topic/subject, `TAKEAWAY`
(short note from the educational objective), `CUSTOM_NOTE`, `STATE` (0 Weak…3 Mastered), `MASTERY`-style
accuracy, counts, and dates. Indexed on `(USER_ID, STATE)` and unique per `(USER_ID, TOPIC_ID)`.
Everything else — test results, topic tags, educational objectives — is **read from existing UWorld
tables**. See `README.md` → *Database* for how to run the script and wire the connection string.

Question banks for retesting are currently per-topic **mock** sets (`services/mock/sticky-note.mock.ts`);
moving them (and persisted scoring) to the backend is the next pass.

## 8. Design decisions / journey

1. **Started** with a literal "sticky wall" (skeuomorphic paper notes, curl/peel animations) to match
   the original pitch.
2. **Pivoted** to a **world-class Minimal-Light** interface (Linear/Vercel) — the paper look was
   dropped for clean topic cards with mastery rings.
3. **Merged** *My Wall* and *Wall of Fame* into a **single module** with tabs.
4. **Replaced** the manual "peel" with **earn-it retesting** — you can't master a topic without
   answering same-concept questions correctly.
5. **Capped** per-attempt gain so a single lucky attempt can't master a topic.
6. **Added spaced repetition** — cooldowns so mastery is proven over days, with a demo time-skip.
7. **Made the strategy configurable** with a strong, science-backed default.

## 9. Running it

See **`README.md`** for exact commands. TL;DR:

```powershell
# Frontend (works standalone on mock data)
cd uwwebtech.uwweb.ustick.web\ClientApp ; npm install ; npm start   # http://localhost:4200

# Backend (optional; serves seed data with no DB)
cd uwwebtech.uwweb.ustick.api ; dotnet run --project uwwebtech.uwweb.ustick.api
```

## 10. Roadmap

- Real backend question bank + persisted spaced-repetition scheduling (per real student).
- Test-submission hook that recomputes mastery automatically after any test (not just retests).
- "Your words your note" editing, streak rewards, an upcoming-reviews calendar / due queue.
- Real auth (UWorld IdentityServer), then a B2B faculty class wall.
