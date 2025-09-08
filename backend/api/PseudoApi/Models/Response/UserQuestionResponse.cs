namespace PseudoApi.Models.Response
{
    public class UserQuestionResponse
    {
        public UserQuestion? Data { get; set; }
        public string? Error { get; set; }
        
        public class UserQuestion
        {
            public string UserQuestionId { get; set; } = string.Empty;
            public string QuestionId { get; set; } = string.Empty;
            public string UserId { get; set; } = string.Empty;
            public bool Solved { get; set; }
        }
    }
}
