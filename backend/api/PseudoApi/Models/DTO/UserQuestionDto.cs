using Newtonsoft.Json;

namespace PseudoApi.Models.DTO
{
    public class UserQuestionDto
    {
        [JsonProperty("user_question_id")]
        public string UserQuestionId { get; set; } = string.Empty;
        
        [JsonProperty("question_id")]
        public string QuestionId { get; set; } = string.Empty;
        
        [JsonProperty("user_id")]
        public string UserId { get; set; } = string.Empty;
        
        [JsonProperty("solved")]
        public bool Solved { get; set; }
    }
}
