using System.Collections.Generic;

namespace uwwebtech.uwweb.ustick.infrastructure.Models
{
    /// <summary>The whole wall for one student: notes grouped into the four stickiness columns.</summary>
    public class WallResponse
    {
        public int UserId { get; set; }
        public List<WallColumn> Columns { get; set; } = new List<WallColumn>();

        /// <summary>Count of notes still on the wall (not yet peeled).</summary>
        public int StuckCount { get; set; }

        /// <summary>Count of notes in the Wall of Fame.</summary>
        public int PeeledCount { get; set; }
    }

    public class WallColumn
    {
        public StickyState State { get; set; }
        public string Title { get; set; }
        public List<StickyNote> Notes { get; set; } = new List<StickyNote>();
    }
}
