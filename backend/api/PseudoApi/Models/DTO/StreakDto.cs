using Newtonsoft.Json;
using Supabase.Postgrest.Models;
using Supabase.Postgrest.Attributes;

namespace PseudoApi.Models.DTO
{
    [Table("weekly_streak")]
    public class StreakDto : BaseModel
    {
        [JsonProperty("id")]
        [PrimaryKey("id")]
        public string StreakId { get; set; } = string.Empty;
        
        [JsonProperty("user_id")]
        [Column("user_id")]
        public string UserId { get; set; } = string.Empty;
        
        [JsonProperty("streak_days")]
        [Column("streak_days")]
        public List<int> StreakDays { get; set; } = new List<int>();
        
        [JsonProperty("week_start")]
        [Column("week_start")]
        public DateTime WeekStartUtc { get; set; }
    }
}
