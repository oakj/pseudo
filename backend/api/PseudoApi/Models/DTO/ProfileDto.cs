using Newtonsoft.Json;

namespace PseudoApi.Models.DTO
{
    public class ProfileDto
    {
        [JsonProperty("user_id")]
        public string UserId { get; set; } = string.Empty;
        
        [JsonProperty("email")]
        public string Email { get; set; } = string.Empty;
        
        [JsonProperty("avatar_url")]
        public string? AvatarUrl { get; set; }
        
        [JsonProperty("dark_mode_preference")]
        public string DarkModePreference { get; set; } = string.Empty;
    }
}
