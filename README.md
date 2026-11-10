# UStick — "Make It Stick"

UWorld hackathon app (team UStick). Your **weak topics** become cards on *The Wall*. You master a
topic by **retesting** same-concept questions, and because mastery is **capped per attempt** and
topics are put on a **spaced-repetition cooldown**, a topic can only be beaten by returning to it
over several days. At 100% mastery it **auto-graduates** to *Mastered*.

Three pieces, all matching UWorld conventions:

| Folder | What |
|--------|------|
| `uwwebtech.uwweb.ustick.web/ClientApp` | Angular 11 SPA — Minimal-Light UI: The Wall (Weak → Improving → Almost there → Mastered), mastery rings, retest dialog, configurable spaced-repetition strategy, Create Test |
| `uwwebtech.uwweb.ustick.api` | .NET 8 Web API — layered Controllers → Services → raw-ADO.NET Repositories |
| `db/StickyNotes.sql` | The **one** new `STICKY_NOTES` table + seed data for the demo student |

## Run the frontend (mock data, no backend/DB needed)

```powershell
cd uwwebtech.uwweb.ustick.web\ClientApp
npm install        # first time only
npm start          # http://localhost:4200  -> redirects to /wall
```

Everything works on mock data out of the box (single demo student "Alex Carter", no login this pass).
Use the **⏩ Simulate day** button on The Wall to fast-forward the clock and watch spaced retests
unlock and topics graduate.

## Run the backend

```powershell
cd uwwebtech.uwweb.ustick.api
dotnet build
dotnet run --project uwwebtech.uwweb.ustick.api   # Swagger at https://localhost:5001/swagger
```

Key endpoints: `GET /stickynote/wall/{userId}`, `GET /stickynote/peel-party/{userId}`,
`POST /stickynote/{id}/custom-note`. **With no connection string configured the API serves seed
data**, so it runs end-to-end without a database.

## Database (SQL Server) — how the SQL file is used

`db/StickyNotes.sql` is the only database artifact. Running it:

1. **Creates `dbo.STICKY_NOTES`** — the single new table the idea needs (one row per weak topic per
   student), plus its indexes. Everything else (test results, question/topic tags, educational
   objectives) is read from **existing UWorld tables** — no other new tables.
2. **Seeds demo rows** for `USER_ID = 1` across the four states, matching the frontend mock so the
   wall looks identical with or without a DB.

Run it against any SQL Server instance (the script is idempotent — safe to re-run):

```powershell
# sqlcmd
sqlcmd -S <server> -d <database> -i db\StickyNotes.sql
# …or just open db\StickyNotes.sql in SSMS / Azure Data Studio and execute.
```

**How the app consumes it.** The .NET data layer uses **raw ADO.NET** (no EF/Dapper):
`uwwebtech.uwweb.ustick.infrastructure/Repositories/StickyNoteRepository.cs` runs
`SELECT … FROM STICKY_NOTES WHERE USER_ID = @UserId` (reads) and an `UPDATE` for a custom note.
It reads the connection string from **`appsettings.json → ConnectionStrings`**:

```jsonc
"ConnectionStrings": {
  "UWComLegal":         "Server=…;Database=…;…",  // used for writes (custom note)
  "UWComLegalReadOnly": "Server=…;Database=…;…"   // used for reads (the wall)
}
```

- **Connection string set** → the repository reads/writes the real `STICKY_NOTES` table.
- **Connection string empty** → the repository falls back to `SeedData.cs` (same rows as the SQL
  seed), so the API still runs. This is why the SQL file is **only required when you want real
  persistence**.

`STATE` column mapping: `0 = Weak`, `1 = Improving`, `2 = Almost there`, `3 = Mastered`.

## Wire all three together (live, no mock)

1. Run `db/StickyNotes.sql`, then fill `ConnectionStrings:UWComLegal*` in the API's `appsettings.json`.
2. In `uwwebtech.uwweb.ustick.web/ClientApp/src/app/services/sticky-note.service.ts` set
   `useMock = false`. The Angular app then reads the live API (CORS is already open for
   `http://localhost:4200`).

## Mastery & spaced repetition

Mastery (0–100) drives each topic's ring and stage (`stateForMastery`). A retest earns **capped**
mastery (a perfect attempt ≈ +20; a weak attempt *drops* it), and crossing into 100% requires
already being ≥ 85% — so no topic can be mastered in a single attempt. After each retest the topic
**locks for a cooldown** (spaced repetition) and resurfaces when due. The schedule is a learner-chosen
**strategy** (`Proven` default / `Cram` / `Relaxed` / `Custom`) defined in
`src/app/core/models/sticky-note.model.ts`. The backend question bank + persisted scoring are the
next pass.
