using System.Collections.Generic;
using System.Threading.Tasks;
using uwwebtech.uwweb.ustick.infrastructure.Models;

namespace uwwebtech.uwweb.ustick.application.Services
{
    public interface IStickyNoteService
    {
        Task<WallResponse> GetWall(int userId);
        Task<List<StickyNote>> GetPeelParty(int userId, int count);
        Task<bool> SaveCustomNote(int stickyNoteId, string customNote);
    }
}
