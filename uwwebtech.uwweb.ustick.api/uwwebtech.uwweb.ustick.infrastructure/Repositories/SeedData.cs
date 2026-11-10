using System;
using System.Collections.Generic;
using uwwebtech.uwweb.ustick.infrastructure.Models;

namespace uwwebtech.uwweb.ustick.infrastructure.Repositories
{
    /// <summary>
    /// Demo wall for the single demo student. Mirrors the seed rows in db/StickyNotes.sql
    /// so behaviour is identical whether or not a database is wired up.
    /// </summary>
    internal static class SeedData
    {
        public static List<StickyNote> ForUser(int userId)
        {
            var now = new DateTime(2026, 11, 10);

            StickyNote Note(int id, string subject, string topic, string takeaway,
                            StickyState state, int stickiness, int accuracy, int seen, int missed,
                            DateTime? peeled = null) => new StickyNote
            {
                StickyNoteId = id,
                UserId = userId,
                SubjectId = 0,
                SubjectName = subject,
                TopicId = id,
                TopicName = topic,
                Takeaway = takeaway,
                CustomNote = null,
                State = state,
                Stickiness = stickiness,
                AccuracyPct = accuracy,
                TimesSeen = seen,
                TimesMissed = missed,
                LastTestedDate = now.AddDays(-id),
                PeeledDate = peeled,
                CreatedDate = now.AddDays(-30),
                ModifiedDate = now.AddDays(-id)
            };

            return new List<StickyNote>
            {
                Note(1, "Criminal Law", "Accomplice Liability",
                    "An accomplice is liable for the planned crime AND any other foreseeable crime that follows from it.",
                    StickyState.StuckHard, 92, 38, 13, 8),
                Note(2, "Evidence", "Hearsay Exceptions",
                    "A present-sense impression must be made while or immediately after perceiving the event — no time to fabricate.",
                    StickyState.StuckHard, 85, 44, 9, 5),
                Note(3, "Real Property", "Recording Acts",
                    "A race-notice statute protects a later buyer only if they had no notice AND recorded first.",
                    StickyState.Peeling, 61, 58, 11, 4),
                Note(4, "Torts", "Negligence - Duty",
                    "A rescuer is a foreseeable plaintiff — 'danger invites rescue', so the original tortfeasor owes them a duty.",
                    StickyState.Peeling, 55, 63, 10, 3),
                Note(5, "Civil Procedure", "Personal Jurisdiction",
                    "Minimum contacts need purposeful availment — a defendant must reach INTO the forum, not merely foresee being hauled there.",
                    StickyState.AlmostGone, 34, 76, 12, 3),
                Note(6, "Constitutional Law", "Standing",
                    "Standing needs injury-in-fact, causation and redressability — a generalized grievance is not enough.",
                    StickyState.AlmostGone, 28, 81, 14, 2),
                Note(7, "Contracts & Sales", "Consideration",
                    "A pre-existing legal duty is not consideration — promising to do what you're already bound to do buys nothing.",
                    StickyState.Peeled, 5, 92, 16, 1, now.AddDays(-2)),
                Note(8, "Criminal Procedure", "Fourth Amendment",
                    "A search needs a reasonable expectation of privacy — what you knowingly expose to the public is not protected.",
                    StickyState.Peeled, 3, 95, 15, 1, now.AddDays(-6))
            };
        }
    }
}
