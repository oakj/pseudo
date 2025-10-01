using Newtonsoft.Json;
using Supabase.Postgrest.Models;
using Supabase.Postgrest.Attributes;

namespace PseudoApi.Models.DTO
{
    [Table("user_question")]
    public class UserQuestionDto : BaseModel
    {
        [JsonProperty("id")]
        [PrimaryKey("id")]
        public string UserQuestionId { get; set; } = string.Empty;
        
        [JsonProperty("question_id")]
        [Column("question_id")]
        public string QuestionId { get; set; } = string.Empty;
        
        [JsonProperty("user_id")]
        [Column("user_id")]
        public string UserId { get; set; } = string.Empty;
        
        [JsonProperty("solved")]
        [Column("solved")]
        public bool Solved { get; set; }
    }
}
