using Newtonsoft.Json;

namespace PseudoApi.Models.DTO
{
    public class QuestionDto
    {
        [JsonProperty("question_id")]
        public string QuestionId { get; set; } = string.Empty;
        
        [JsonProperty("title")]
        public string Title { get; set; } = string.Empty;
        
        [JsonProperty("difficulty")]
        public string Difficulty { get; set; } = string.Empty;
        
        [JsonProperty("is_solved")]
        public bool IsSolved { get; set; }
        
        [JsonProperty("design_patterns")]
        public List<string>? DesignPatterns { get; set; }
    }
}
