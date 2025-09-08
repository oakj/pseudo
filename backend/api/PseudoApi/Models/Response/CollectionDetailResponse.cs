namespace PseudoApi.Models.Response
{
    public class CollectionDetailResponse
    {
        public CollectionQuestion? Data { get; set; }
        public string? Error { get; set; }
        
        public class CollectionQuestion
        {
            public UserInfo User { get; set; } = new();
            public CollectionInfo Collection { get; set; } = new();
            public List<QuestionInfo> Questions { get; set; } = new List<QuestionInfo>();
            
            public class UserInfo
            {
                public string UserId { get; set; } = string.Empty;
            }
            
            public class CollectionInfo
            {
                public string CollectionId { get; set; } = string.Empty;
                public string CollectionName { get; set; } = string.Empty;
            }
            
            public class QuestionInfo
            {
                public string QuestionId { get; set; } = string.Empty;
                public string QuestionTitle { get; set; } = string.Empty;
                public bool Solved { get; set; }
                public string Difficulty { get; set; } = string.Empty;
                public List<string> DesignPatterns { get; set; } = new List<string>();
            }
        }
    }
}
