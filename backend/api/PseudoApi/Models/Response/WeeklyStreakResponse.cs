namespace PseudoApi.Models.Response
{
    public class WeeklyStreakResponse
    {
        public WeeklyStreak? Data { get; set; }
        public string? Error { get; set; }
        
        public class WeeklyStreak
        {
            public List<int> StreakDays { get; set; } = new List<int>();
            public DateTime WeekStartUtc { get; set; }
        }
    }
}
