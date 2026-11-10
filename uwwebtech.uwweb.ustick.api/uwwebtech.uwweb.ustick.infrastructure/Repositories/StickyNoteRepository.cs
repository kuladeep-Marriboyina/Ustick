using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
using uwwebtech.uwweb.ustick.infrastructure.DbUtils;
using uwwebtech.uwweb.ustick.infrastructure.Models;

namespace uwwebtech.uwweb.ustick.infrastructure.Repositories
{
    /// <summary>
    /// Raw ADO.NET access to STICKY_NOTES (UWorld convention: no EF/Dapper).
    /// When no connection string is configured (foundation pass / local dev with no DB),
    /// falls back to seed data so the wall still renders end-to-end.
    /// </summary>
    public class StickyNoteRepository : IStickyNoteRepository
    {
        private readonly DbConnections _dbConnections;

        public StickyNoteRepository(IOptions<DbConnections> dbConnections)
        {
            _dbConnections = dbConnections.Value;
        }

        public async Task<List<StickyNote>> GetNotesByUser(int userId)
        {
            string connectionString = _dbConnections?.UWComLegalReadOnly;

            // Foundation pass: no DB wired yet -> serve seed data.
            if (string.IsNullOrWhiteSpace(connectionString))
                return SeedData.ForUser(userId);

            var notes = new List<StickyNote>();
            using (SqlConnection conn = DbUtility.GetSqlConnection(connectionString))
            {
                await conn.OpenAsync();

                const string sql = @"
                    SELECT STICKY_NOTE_ID, USER_ID, SUBJECT_ID, SUBJECT_NAME, TOPIC_ID, TOPIC_NAME,
                           TAKEAWAY, CUSTOM_NOTE, STATE, STICKINESS, ACCURACY_PCT, TIMES_SEEN,
                           TIMES_MISSED, LAST_TESTED_DATE, PEELED_DATE, CREATED_DATE, MODIFIED_DATE
                    FROM STICKY_NOTES
                    WHERE USER_ID = @UserId
                    ORDER BY STICKINESS DESC";

                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@UserId", userId);

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                            notes.Add(Map(reader));
                    }
                }
            }

            return notes;
        }

        public async Task<bool> UpdateCustomNote(int stickyNoteId, string customNote)
        {
            string connectionString = _dbConnections?.UWComLegal;

            // Foundation pass: no DB wired yet -> pretend it saved.
            if (string.IsNullOrWhiteSpace(connectionString))
                return true;

            using (SqlConnection conn = DbUtility.GetSqlConnection(connectionString))
            {
                await conn.OpenAsync();

                const string sql = @"
                    UPDATE STICKY_NOTES
                    SET CUSTOM_NOTE = @CustomNote, MODIFIED_DATE = SYSUTCDATETIME()
                    WHERE STICKY_NOTE_ID = @StickyNoteId";

                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@CustomNote", (object)customNote ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@StickyNoteId", stickyNoteId);

                    int rows = await cmd.ExecuteNonQueryAsync();
                    return rows > 0;
                }
            }
        }

        private static StickyNote Map(SqlDataReader r)
        {
            return new StickyNote
            {
                StickyNoteId = r.GetInt32(r.GetOrdinal("STICKY_NOTE_ID")),
                UserId = r.GetInt32(r.GetOrdinal("USER_ID")),
                SubjectId = r.GetInt32(r.GetOrdinal("SUBJECT_ID")),
                SubjectName = GetStringOrNull(r, "SUBJECT_NAME"),
                TopicId = r.GetInt32(r.GetOrdinal("TOPIC_ID")),
                TopicName = GetStringOrNull(r, "TOPIC_NAME"),
                Takeaway = GetStringOrNull(r, "TAKEAWAY"),
                CustomNote = GetStringOrNull(r, "CUSTOM_NOTE"),
                State = (StickyState)r.GetByte(r.GetOrdinal("STATE")),
                Stickiness = r.GetInt32(r.GetOrdinal("STICKINESS")),
                AccuracyPct = r.GetInt32(r.GetOrdinal("ACCURACY_PCT")),
                TimesSeen = r.GetInt32(r.GetOrdinal("TIMES_SEEN")),
                TimesMissed = r.GetInt32(r.GetOrdinal("TIMES_MISSED")),
                LastTestedDate = GetDateOrNull(r, "LAST_TESTED_DATE"),
                PeeledDate = GetDateOrNull(r, "PEELED_DATE"),
                CreatedDate = r.GetDateTime(r.GetOrdinal("CREATED_DATE")),
                ModifiedDate = r.GetDateTime(r.GetOrdinal("MODIFIED_DATE"))
            };
        }

        private static string GetStringOrNull(SqlDataReader r, string col)
        {
            int i = r.GetOrdinal(col);
            return r.IsDBNull(i) ? null : r.GetString(i);
        }

        private static DateTime? GetDateOrNull(SqlDataReader r, string col)
        {
            int i = r.GetOrdinal(col);
            return r.IsDBNull(i) ? (DateTime?)null : r.GetDateTime(i);
        }
    }
}
