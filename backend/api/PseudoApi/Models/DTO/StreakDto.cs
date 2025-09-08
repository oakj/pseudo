using Newtonsoft.Json;

namespace PseudoApi.Models.DTO
{
    public class StreakDto
    {
        [JsonProperty("streak_id")]
        public string StreakId { get; set; } = string.Empty;
        
        [JsonProperty("user_id")]
        public string UserId { get; set; } = string.Empty;
        
        [JsonProperty("streak_days")]
        public List<int> StreakDays { get; set; } = new List<int>();
        
        [JsonProperty("week_start_utc")]
        public DateTime WeekStartUtc { get; set; }
    }
}
