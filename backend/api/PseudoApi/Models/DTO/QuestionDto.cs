using Newtonsoft.Json;
using Supabase.Postgrest.Models;
using Supabase.Postgrest.Attributes;

namespace PseudoApi.Models.DTO
{
    [Table("question")]
    public class QuestionDto : BaseModel
    {
        [JsonProperty("id")]
        [PrimaryKey("id")]
        public string QuestionId { get; set; } = string.Empty;
        
        [JsonProperty("title")]
        [Column("title")]
        public string Title { get; set; } = string.Empty;
        
        [JsonProperty("difficulty")]
        [Column("difficulty")]
        public string Difficulty { get; set; } = string.Empty;
        
        [JsonProperty("is_solved")]
        [Column("is_solved")]
        public bool? IsSolved { get; set; }
        
        [JsonProperty("design_patterns")]
        [Column("design_patterns")]
        public List<string>? DesignPatterns { get; set; }
    }
}
