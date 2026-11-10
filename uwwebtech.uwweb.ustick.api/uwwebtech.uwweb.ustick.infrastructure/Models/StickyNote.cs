using System;

namespace uwwebtech.uwweb.ustick.infrastructure.Models
{
    /// <summary>
    /// One weak topic for a student, rendered as a sticky note on the wall.
    /// Maps one-to-one to a row in the STICKY_NOTES table.
    /// </summary>
    public class StickyNote
    {
        public int StickyNoteId { get; set; }
        public int UserId { get; set; }
        public int SubjectId { get; set; }
        public string SubjectName { get; set; }
        public int TopicId { get; set; }
        public string TopicName { get; set; }

        /// <summary>Short takeaway drawn from the educational objective of a missed question.</summary>
        public string Takeaway { get; set; }

        /// <summary>Student's own rewrite ("Your words your note"); null until edited.</summary>
        public string CustomNote { get; set; }

        public StickyState State { get; set; }

        /// <summary>0-100. Higher = stuck harder. Drives peel vs slam animation.</summary>
        public int Stickiness { get; set; }

        public int AccuracyPct { get; set; }
        public int TimesSeen { get; set; }
        public int TimesMissed { get; set; }

        public DateTime? LastTestedDate { get; set; }
        public DateTime? PeeledDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
