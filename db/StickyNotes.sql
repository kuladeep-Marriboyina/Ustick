/* =============================================================================
   UStick - "Make It Stick: the sticky wall of mistakes"
   The ONE new table the idea requires. Everything else (test results, topic
   tags, educational objectives) is read from existing UWorld tables.

   STATE: 0 = Stuck Hard, 1 = Peeling, 2 = Almost Gone, 3 = Peeled (Wall of Fame)
   ============================================================================= */

IF OBJECT_ID('dbo.STICKY_NOTES', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.STICKY_NOTES
    (
        STICKY_NOTE_ID    INT            IDENTITY(1,1) NOT NULL,
        USER_ID           INT            NOT NULL,
        SUBJECT_ID        INT            NOT NULL,
        SUBJECT_NAME      NVARCHAR(100)  NULL,
        TOPIC_ID          INT            NOT NULL,
        TOPIC_NAME        NVARCHAR(150)  NULL,
        TAKEAWAY          NVARCHAR(500)  NULL,   -- short note from the educational objective
        CUSTOM_NOTE       NVARCHAR(500)  NULL,   -- "Your words your note" rewrite
        STATE             TINYINT        NOT NULL DEFAULT (0),
        STICKINESS        INT            NOT NULL DEFAULT (0),   -- 0-100, higher = stuck harder
        ACCURACY_PCT      INT            NOT NULL DEFAULT (0),
        TIMES_SEEN        INT            NOT NULL DEFAULT (0),
        TIMES_MISSED      INT            NOT NULL DEFAULT (0),
        LAST_TESTED_DATE  DATETIME2(0)   NULL,
        PEELED_DATE       DATETIME2(0)   NULL,
        CREATED_DATE      DATETIME2(0)   NOT NULL DEFAULT (SYSUTCDATETIME()),
        MODIFIED_DATE     DATETIME2(0)   NOT NULL DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_STICKY_NOTES PRIMARY KEY CLUSTERED (STICKY_NOTE_ID)
    );

    CREATE NONCLUSTERED INDEX IX_STICKY_NOTES_USER_STATE
        ON dbo.STICKY_NOTES (USER_ID, STATE) INCLUDE (STICKINESS);

    -- A student has one note per topic.
    CREATE UNIQUE NONCLUSTERED INDEX UX_STICKY_NOTES_USER_TOPIC
        ON dbo.STICKY_NOTES (USER_ID, TOPIC_ID);
END
GO

/* ---------------------------------------------------------------------------
   Seed the demo student (USER_ID = 1). Mirrors infrastructure/Repositories/SeedData.cs
   so the wall looks identical with or without a live DB.
   --------------------------------------------------------------------------- */
IF NOT EXISTS (SELECT 1 FROM dbo.STICKY_NOTES WHERE USER_ID = 1)
BEGIN
    INSERT INTO dbo.STICKY_NOTES
        (USER_ID, SUBJECT_ID, SUBJECT_NAME, TOPIC_ID, TOPIC_NAME, TAKEAWAY,
         STATE, STICKINESS, ACCURACY_PCT, TIMES_SEEN, TIMES_MISSED, LAST_TESTED_DATE, PEELED_DATE)
    VALUES
        (1, 0, N'Criminal Law',        1, N'Accomplice Liability',
            N'An accomplice is liable for the planned crime AND any other foreseeable crime that follows from it.',
            0, 92, 38, 13, 8, DATEADD(DAY, -1,  SYSUTCDATETIME()), NULL),
        (1, 0, N'Evidence',            2, N'Hearsay Exceptions',
            N'A present-sense impression must be made while or immediately after perceiving the event - no time to fabricate.',
            0, 85, 44,  9, 5, DATEADD(DAY, -2,  SYSUTCDATETIME()), NULL),
        (1, 0, N'Real Property',       3, N'Recording Acts',
            N'A race-notice statute protects a later buyer only if they had no notice AND recorded first.',
            1, 61, 58, 11, 4, DATEADD(DAY, -3,  SYSUTCDATETIME()), NULL),
        (1, 0, N'Torts',               4, N'Negligence - Duty',
            N'A rescuer is a foreseeable plaintiff - "danger invites rescue", so the original tortfeasor owes them a duty.',
            1, 55, 63, 10, 3, DATEADD(DAY, -4,  SYSUTCDATETIME()), NULL),
        (1, 0, N'Civil Procedure',     5, N'Personal Jurisdiction',
            N'Minimum contacts need purposeful availment - a defendant must reach INTO the forum, not merely foresee being hauled there.',
            2, 34, 76, 12, 3, DATEADD(DAY, -5,  SYSUTCDATETIME()), NULL),
        (1, 0, N'Constitutional Law',  6, N'Standing',
            N'Standing needs injury-in-fact, causation and redressability - a generalized grievance is not enough.',
            2, 28, 81, 14, 2, DATEADD(DAY, -6,  SYSUTCDATETIME()), NULL),
        (1, 0, N'Contracts & Sales',   7, N'Consideration',
            N'A pre-existing legal duty is not consideration - promising to do what you are already bound to do buys nothing.',
            3,  5, 92, 16, 1, DATEADD(DAY, -8,  SYSUTCDATETIME()), DATEADD(DAY, -2, SYSUTCDATETIME())),
        (1, 0, N'Criminal Procedure',  8, N'Fourth Amendment',
            N'A search needs a reasonable expectation of privacy - what you knowingly expose to the public is not protected.',
            3,  3, 95, 15, 1, DATEADD(DAY, -10, SYSUTCDATETIME()), DATEADD(DAY, -6, SYSUTCDATETIME()));
END
GO

-- SELECT * FROM dbo.STICKY_NOTES WHERE USER_ID = 1 ORDER BY STICKINESS DESC;
