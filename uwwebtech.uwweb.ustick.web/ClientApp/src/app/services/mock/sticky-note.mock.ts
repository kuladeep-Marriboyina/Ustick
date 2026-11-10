import { StickyNote, StickyState, TopicQuestion, WallResponse } from '../../core/models/sticky-note.model';

function daysAgo(n: number): string {
  const d = new Date('2026-11-10T00:00:00');
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

let id = 0;
function note(
  subjectName: string, topicName: string, takeaway: string,
  state: StickyState, mastery: number, timesSeen: number, timesMissed: number, peeled = false
): StickyNote {
  id += 1;
  return {
    stickyNoteId: id, userId: 1, subjectId: 0, subjectName,
    topicId: id, topicName, takeaway, customNote: null,
    state, stickiness: 100 - mastery, mastery, accuracyPct: mastery,
    strongStreak: 0, dueDate: peeled ? null : daysAgo(0),
    timesSeen, timesMissed,
    lastTestedDate: daysAgo(id), peeledDate: peeled ? daysAgo(id + 1) : null,
    createdDate: daysAgo(30), modifiedDate: daysAgo(id)
  };
}

export const MOCK_NOTES: StickyNote[] = [
  note('Criminal Law', 'Accomplice Liability',
    'An accomplice is liable for the planned crime AND any other foreseeable crime that follows from it.',
    StickyState.StuckHard, 38, 13, 8),
  note('Evidence', 'Hearsay Exceptions',
    'A present-sense impression must be made while or immediately after perceiving the event.',
    StickyState.StuckHard, 44, 9, 5),
  note('Real Property', 'Recording Acts',
    'A race-notice statute protects a later buyer only if they had no notice AND recorded first.',
    StickyState.Peeling, 58, 11, 4),
  note('Torts', 'Negligence — Duty',
    'A rescuer is a foreseeable plaintiff — "danger invites rescue".',
    StickyState.Peeling, 63, 10, 3),
  note('Civil Procedure', 'Personal Jurisdiction',
    'Minimum contacts need purposeful availment — the defendant must reach into the forum.',
    StickyState.AlmostGone, 76, 12, 3),
  note('Constitutional Law', 'Standing',
    'Standing needs injury-in-fact, causation and redressability.',
    StickyState.AlmostGone, 81, 14, 2),
  note('Contracts & Sales', 'Consideration',
    'A pre-existing legal duty is not consideration.',
    StickyState.Peeled, 100, 16, 1, true),
  note('Criminal Procedure', 'Fourth Amendment',
    'A search needs a reasonable expectation of privacy.',
    StickyState.Peeled, 100, 15, 1, true)
];

export const TOPIC_QUESTIONS: Record<number, TopicQuestion[]> = {
  1: [
    { id: 101, stem: 'A and B plan to rob a store. During the robbery B unexpectedly shoots a clerk. Is A liable for the shooting?',
      options: [
        { key: 'A', text: 'No — A only agreed to the robbery' },
        { key: 'B', text: 'Yes — the shooting was a foreseeable consequence of the armed robbery' },
        { key: 'C', text: 'No — only the person who pulled the trigger is liable' },
        { key: 'D', text: 'Yes — but only if A knew B was armed' }
      ], correctKey: 'B',
      rationale: 'An accomplice is liable for the target crime and any other foreseeable crime committed in furtherance of it.' },
    { id: 102, stem: 'Which best states the scope of accomplice liability?',
      options: [
        { key: 'A', text: 'Only the planned crime' },
        { key: 'B', text: 'Any crime the principal commits that day' },
        { key: 'C', text: 'The planned crime plus foreseeable crimes flowing from it' },
        { key: 'D', text: 'Only crimes the accomplice physically helped commit' }
      ], correctKey: 'C',
      rationale: 'Liability extends to the planned crime AND foreseeable crimes that follow from it.' },
    { id: 103, stem: 'Getaway driver D waits outside while the principal commits an unplanned assault inside. D is:',
      options: [
        { key: 'A', text: 'Not liable — D never entered' },
        { key: 'B', text: 'Liable if the assault was a foreseeable result of the planned crime' },
        { key: 'C', text: 'Liable for everything the principal ever does' },
        { key: 'D', text: 'Liable only for the getaway' }
      ], correctKey: 'B',
      rationale: 'Foreseeability is the test — presence at the scene is not required.' }
  ],
  2: [
    { id: 201, stem: 'A witness says "that car just ran the red light!" as it happens. This is admissible as:',
      options: [
        { key: 'A', text: 'A present-sense impression' },
        { key: 'B', text: 'A dying declaration' },
        { key: 'C', text: 'Inadmissible hearsay' },
        { key: 'D', text: 'An opinion' }
      ], correctKey: 'A',
      rationale: 'A present-sense impression describes an event while or immediately after perceiving it.' },
    { id: 202, stem: 'Why does the present-sense impression exception exist?',
      options: [
        { key: 'A', text: 'The declarant is always an expert' },
        { key: 'B', text: 'Contemporaneity leaves no time to fabricate' },
        { key: 'C', text: 'It is always written down' },
        { key: 'D', text: 'The declarant is unavailable' }
      ], correctKey: 'B',
      rationale: 'The lack of time to fabricate is what makes it trustworthy.' },
    { id: 203, stem: 'A statement made two hours after the event, calmly recalled, is:',
      options: [
        { key: 'A', text: 'A present-sense impression' },
        { key: 'B', text: 'Not a present-sense impression — too much time elapsed' },
        { key: 'C', text: 'Always admissible' },
        { key: 'D', text: 'A business record' }
      ], correctKey: 'B',
      rationale: 'It must be made while or immediately after perceiving the event.' }
  ],
  3: [
    { id: 301, stem: 'Under a race-notice statute, a later buyer prevails only if they:',
      options: [
        { key: 'A', text: 'Record first, regardless of notice' },
        { key: 'B', text: 'Had no notice AND recorded first' },
        { key: 'C', text: 'Paid the most money' },
        { key: 'D', text: 'Had no notice, even if they recorded second' }
      ], correctKey: 'B',
      rationale: 'Race-notice requires both: no notice and first to record.' },
    { id: 302, stem: 'Buyer 2 knew of Buyer 1 but recorded first. Under race-notice, Buyer 2:',
      options: [
        { key: 'A', text: 'Wins — recorded first' },
        { key: 'B', text: 'Loses — had notice' },
        { key: 'C', text: 'Wins — paid value' },
        { key: 'D', text: 'It depends on the deed color' }
      ], correctKey: 'B',
      rationale: 'Notice defeats a later buyer under a race-notice statute even if they record first.' }
  ],
  4: [
    { id: 401, stem: 'A negligent driver causes a crash; a bystander is hurt attempting a rescue. The driver owes the rescuer a duty because:',
      options: [
        { key: 'A', text: 'Rescuers assume all risk' },
        { key: 'B', text: 'Danger invites rescue — the rescuer is a foreseeable plaintiff' },
        { key: 'C', text: 'Only the first victim is owed a duty' },
        { key: 'D', text: 'There is never a duty to rescuers' }
      ], correctKey: 'B',
      rationale: '"Danger invites rescue" — the rescuer is foreseeable, so a duty is owed.' },
    { id: 402, stem: 'The "danger invites rescue" doctrine makes the rescuer:',
      options: [
        { key: 'A', text: 'An unforeseeable plaintiff' },
        { key: 'B', text: 'A foreseeable plaintiff owed a duty' },
        { key: 'C', text: 'Liable to the original victim' },
        { key: 'D', text: 'Barred from recovery' }
      ], correctKey: 'B',
      rationale: 'The doctrine treats rescuers as foreseeable plaintiffs.' }
  ],
  5: [
    { id: 501, stem: 'Specific personal jurisdiction requires that the defendant:',
      options: [
        { key: 'A', text: 'Merely foresaw being sued somewhere' },
        { key: 'B', text: 'Purposefully availed itself of the forum' },
        { key: 'C', text: 'Owns property anywhere in the US' },
        { key: 'D', text: 'Has a website' }
      ], correctKey: 'B',
      rationale: 'Minimum contacts require purposeful availment — reaching into the forum.' },
    { id: 502, stem: 'A product swept into the forum by chance, with no targeting, generally:',
      options: [
        { key: 'A', text: 'Creates jurisdiction automatically' },
        { key: 'B', text: 'Does not establish purposeful availment' },
        { key: 'C', text: 'Always establishes general jurisdiction' },
        { key: 'D', text: 'Waives all defenses' }
      ], correctKey: 'B',
      rationale: 'Foreseeability of being hauled in is not enough; purposeful availment is required.' }
  ],
  6: [
    { id: 601, stem: 'The three constitutional standing requirements are:',
      options: [
        { key: 'A', text: 'Injury, causation, redressability' },
        { key: 'B', text: 'Harm, malice, damages' },
        { key: 'C', text: 'Notice, hearing, appeal' },
        { key: 'D', text: 'Duty, breach, causation' }
      ], correctKey: 'A',
      rationale: 'Standing = injury-in-fact, causation, and redressability.' },
    { id: 602, stem: 'A plaintiff alleging only a generalized grievance shared by all citizens:',
      options: [
        { key: 'A', text: 'Has standing' },
        { key: 'B', text: 'Lacks standing — no particularized injury' },
        { key: 'C', text: 'Has standing if sincere' },
        { key: 'D', text: 'Has standing in federal court only' }
      ], correctKey: 'B',
      rationale: 'A generalized grievance is not a concrete, particularized injury-in-fact.' }
  ]
};

const COLUMN_TITLES: Array<{ state: StickyState; title: string }> = [
  { state: StickyState.StuckHard, title: 'Weak' },
  { state: StickyState.Peeling, title: 'Improving' },
  { state: StickyState.AlmostGone, title: 'Almost there' },
  { state: StickyState.Peeled, title: 'Mastered' }
];

export function buildMockWall(userId: number): WallResponse {
  return {
    userId,
    columns: COLUMN_TITLES.map(c => ({
      state: c.state,
      title: c.title,
      notes: MOCK_NOTES.filter(n => n.state === c.state).sort((a, b) => a.mastery - b.mastery)
    })),
    stuckCount: MOCK_NOTES.filter(n => n.state !== StickyState.Peeled).length,
    peeledCount: MOCK_NOTES.filter(n => n.state === StickyState.Peeled).length
  };
}
