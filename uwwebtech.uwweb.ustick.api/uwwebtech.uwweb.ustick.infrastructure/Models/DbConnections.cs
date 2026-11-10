namespace uwwebtech.uwweb.ustick.infrastructure.Models
{
    /// <summary>
    /// Bound from the ConnectionStrings section of appsettings.json via Configure&lt;DbConnections&gt;.
    /// Mirrors the UWorld convention of a POCO per connection (read/write split).
    /// </summary>
    public class DbConnections
    {
        public string UWComLegal { get; set; }
        public string UWComLegalReadOnly { get; set; }
    }
}
