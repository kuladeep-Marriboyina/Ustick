using Microsoft.Data.SqlClient;

namespace uwwebtech.uwweb.ustick.infrastructure.DbUtils
{
    /// <summary>
    /// Thin helper around SqlConnection, mirroring the UWorld DbUtility convention.
    /// </summary>
    public static class DbUtility
    {
        public static SqlConnection GetSqlConnection(string connectionString)
        {
            if (string.IsNullOrWhiteSpace(connectionString))
                return null;

            return new SqlConnection(connectionString);
        }
    }
}
