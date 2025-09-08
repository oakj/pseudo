using Newtonsoft.Json;

namespace PseudoApi.Models.DTO
{
    public class CollectionDto
    {
        [JsonProperty("collection_id")]
        public string CollectionId { get; set; } = string.Empty;
        
        [JsonProperty("collection_name")]
        public string CollectionName { get; set; } = string.Empty;
        
        [JsonProperty("is_default")]
        public bool IsDefault { get; set; }
        
        [JsonProperty("user_id")]
        public string? UserId { get; set; }
    }
}
