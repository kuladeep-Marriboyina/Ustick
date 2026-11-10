namespace uwwebtech.uwweb.ustick.infrastructure.Models
{
    /// <summary>
    /// The four columns of the wall. A note's state is derived from recent accuracy on its topic.
    /// </summary>
    public enum StickyState
    {
        StuckHard = 0,
        Peeling = 1,
        AlmostGone = 2,
        Peeled = 3
    }
}
