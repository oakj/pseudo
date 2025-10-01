using Newtonsoft.Json;
using Supabase.Postgrest.Models;
using Supabase.Postgrest.Attributes;

namespace PseudoApi.Models.DTO
{
    [Table("collections")]
    public class CollectionDto : BaseModel
    {
        [JsonProperty("collection_id")]
        [PrimaryKey("collection_id")]
        public string CollectionId { get; set; } = string.Empty;
        
        [JsonProperty("collection_name")]
        [Column("collection_name")]
        public string CollectionName { get; set; } = string.Empty;
        
        [JsonProperty("is_default")]
        [Column("is_default")]
        public bool IsDefault { get; set; }
        
        [JsonProperty("user_id")]
        [Column("user_id")]
        public string? UserId { get; set; }
    }
}
