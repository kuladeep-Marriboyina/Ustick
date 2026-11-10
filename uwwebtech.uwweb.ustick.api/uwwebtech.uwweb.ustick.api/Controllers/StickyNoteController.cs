using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using uwwebtech.uwweb.ustick.application.Services;

namespace uwwebtech.uwweb.ustick.api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StickyNoteController : ControllerBase
    {
        private readonly IStickyNoteService _stickyNoteService;

        public StickyNoteController(IStickyNoteService stickyNoteService)
        {
            _stickyNoteService = stickyNoteService;
        }

        [HttpGet("")]
        [AllowAnonymous]
        public string HealthCheck()
        {
            return "UStick API is alive. Stick it. Fix it. Peel it.";
        }

        /// <summary>The whole wall for a student, grouped into the four stickiness columns.</summary>
        [HttpGet("wall/{userId:int}")]
        public async Task<ActionResult> GetWall(int userId)
        {
            var wall = await _stickyNoteService.GetWall(userId);
            return Ok(wall);
        }

        /// <summary>The stickiest notes still on the wall — one-tap retest ("Peel Party").</summary>
        [HttpGet("peel-party/{userId:int}")]
        public async Task<ActionResult> GetPeelParty(int userId, [FromQuery] int count = 5)
        {
            var notes = await _stickyNoteService.GetPeelParty(userId, count);
            return Ok(notes);
        }

        /// <summary>Save the student's own rewrite of a note ("Your words your note").</summary>
        [HttpPost("{id:int}/custom-note")]
        public async Task<ActionResult> SaveCustomNote(int id, [FromBody] CustomNoteRequest request)
        {
            bool saved = await _stickyNoteService.SaveCustomNote(id, request?.CustomNote);
            return Ok(new { saved });
        }
    }

    public class CustomNoteRequest
    {
        public string CustomNote { get; set; }
    }
}
