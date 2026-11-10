using System.Collections.Generic;
using System.Threading.Tasks;
using uwwebtech.uwweb.ustick.infrastructure.Models;

namespace uwwebtech.uwweb.ustick.infrastructure.Repositories
{
    public interface IStickyNoteRepository
    {
        Task<List<StickyNote>> GetNotesByUser(int userId);
        Task<bool> UpdateCustomNote(int stickyNoteId, string customNote);
    }
}
