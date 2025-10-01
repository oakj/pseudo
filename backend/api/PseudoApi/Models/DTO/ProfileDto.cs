using Newtonsoft.Json;
using Supabase.Postgrest.Models;
using Supabase.Postgrest.Attributes;

namespace PseudoApi.Models.DTO
{
    [Table("app_user")]
    public class ProfileDto : BaseModel
    {
        [JsonProperty("id")]
        [PrimaryKey("id")]
        public string UserId { get; set; } = string.Empty;
        
        [JsonProperty("email")]
        [Column("email")]
        public string Email { get; set; } = string.Empty;
        
        [JsonProperty("avatar_url")]
        [Column("avatar_url")]
        public string? AvatarUrl { get; set; }
        
        [JsonProperty("dark_mode_preference")]
        [Column("dark_mode_preference")]
        public string DarkModePreference { get; set; } = string.Empty;
    }
}
