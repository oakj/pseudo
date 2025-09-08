namespace PseudoApi.Models.Response
{
    public class QuestionResponse
    {
        public List<Question>? Data { get; set; }
        public string? Error { get; set; }
        
        public class Question
        {
            public string QuestionId { get; set; } = string.Empty;
            public string Title { get; set; } = string.Empty;
            public string Difficulty { get; set; } = string.Empty;
            public bool IsSolved { get; set; }
            public bool? SavedToCollection { get; set; }
            public List<string>? DesignPatterns { get; set; }
        }
    }
}
