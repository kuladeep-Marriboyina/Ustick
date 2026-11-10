# UStick — "Make It Stick: the Sticky Wall of Mistakes"

UWorld hackathon app (team UStick). Weak topics become sticky notes on a wall; a note
only peels into the **Wall of Fame** when the student gets strong on that topic.
**Stick it. Fix it. Peel it.**

Three pieces, all matching UWorld conventions:

| Folder | What |
|--------|------|
| `uwwebtech.uwweb.ustick.web/ClientApp` | Angular 11 + Material SPA (left sidebar + top bar, Wall = 4 stickiness columns, Create Test, Wall of Fame) |
| `uwwebtech.uwweb.ustick.api` | .NET 8 Web API — layered Controllers → Services → raw-ADO.NET Repositories |
| `db/StickyNotes.sql` | The one new `STICKY_NOTES` table + seed data for the demo student |

## Run the frontend (mock data, no backend needed)

```powershell
cd uwwebtech.uwweb.ustick.web\ClientApp
npm install        # first time only
npm start          # http://localhost:4200  -> redirects to /wall
```

The Wall, Create Test and Wall of Fame all work on mock data out of the box
(single demo student "Alex Carter", no login this pass).

## Run the backend

```powershell
cd uwwebtech.uwweb.ustick.api
dotnet build
dotnet run --project uwwebtech.uwweb.ustick.api   # Swagger at https://localhost:5001/swagger
```

Key endpoints: `GET /stickynote/wall/{userId}`, `GET /stickynote/peel-party/{userId}`,
`POST /stickynote/{id}/custom-note`. With no connection string configured the API
serves the same seed wall as the frontend, so it runs end-to-end without a database.

## Wire the three together (optional)

1. Run `db/StickyNotes.sql` against SQL Server and put the connection string in
   `uwwebtech.uwweb.ustick.api/.../appsettings.json` (`ConnectionStrings:UWComLegal*`).
2. In `uwwebtech.uwweb.ustick.web/ClientApp/src/app/services/sticky-note.service.ts`
   set `useMock = false`. The Angular app then reads the live API (CORS is already
   open for `http://localhost:4200`).

## Stickiness states

`0 Stuck Hard` → `1 Peeling` → `2 Almost Gone` → `3 Wall of Fame (Peeled)`, derived from
recent accuracy on the topic. Threshold tuning + the test-submission recompute hook are
the next feature pass.
