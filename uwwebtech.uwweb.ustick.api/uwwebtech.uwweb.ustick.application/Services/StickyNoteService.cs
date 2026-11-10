using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using uwwebtech.uwweb.ustick.infrastructure.Models;
using uwwebtech.uwweb.ustick.infrastructure.Repositories;

namespace uwwebtech.uwweb.ustick.application.Services
{
    public class StickyNoteService : IStickyNoteService
    {
        private readonly IStickyNoteRepository _repository;

        public StickyNoteService(IStickyNoteRepository repository)
        {
            _repository = repository;
        }

        public async Task<WallResponse> GetWall(int userId)
        {
            var notes = await _repository.GetNotesByUser(userId);

            var response = new WallResponse
            {
                UserId = userId,
                Columns = BuildColumns(notes),
                StuckCount = notes.Count(n => n.State != StickyState.Peeled),
                PeeledCount = notes.Count(n => n.State == StickyState.Peeled)
            };

            return response;
        }

        public async Task<List<StickyNote>> GetPeelParty(int userId, int count)
        {
            var notes = await _repository.GetNotesByUser(userId);

            // The stickiest notes still on the wall are the best candidates to retest.
            return notes
                .Where(n => n.State != StickyState.Peeled)
                .OrderByDescending(n => n.Stickiness)
                .Take(count)
                .ToList();
        }

        public Task<bool> SaveCustomNote(int stickyNoteId, string customNote)
        {
            return _repository.UpdateCustomNote(stickyNoteId, customNote);
        }

        private static List<WallColumn> BuildColumns(List<StickyNote> notes)
        {
            var titles = new[]
            {
                (StickyState.StuckHard, "Stuck Hard"),
                (StickyState.Peeling, "Peeling"),
                (StickyState.AlmostGone, "Almost Gone"),
                (StickyState.Peeled, "Wall of Fame")
            };

            return titles
                .Select(t => new WallColumn
                {
                    State = t.Item1,
                    Title = t.Item2,
                    Notes = notes
                        .Where(n => n.State == t.Item1)
                        .OrderByDescending(n => n.Stickiness)
                        .ToList()
                })
                .ToList();
        }
    }
}
