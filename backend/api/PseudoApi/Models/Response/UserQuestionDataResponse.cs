namespace PseudoApi.Models.Response
{
    public class UserQuestionDataResponse
    {
        public UserQuestionData? Data { get; set; }
        public string? Error { get; set; }
        
        public class UserQuestionData
        {
            public string UserId { get; set; } = string.Empty;
            public string QuestionId { get; set; } = string.Empty;
            public Submission? SubmissionData { get; set; }
            public HintChat HintChatData { get; set; } = new();
            
            public class Submission
            {
                public Solution SolutionData { get; set; } = new();
                public string Timestamp { get; set; } = string.Empty;
                public Evaluation? EvaluationData { get; set; }
                
                public class Solution
                {
                    public List<CodeLine> Lines { get; set; } = new List<CodeLine>();
                    
                    public class CodeLine
                    {
                        public int Number { get; set; }
                        public string Text { get; set; } = string.Empty;
                    }
                }
                
                public class Evaluation
                {
                    public int Score { get; set; }
                    public Feedback FeedbackData { get; set; } = new();
                    
                    public class Feedback
                    {
                        public FeedbackCategory Correctness { get; set; } = new();
                        public FeedbackCategory Complexity { get; set; } = new();
                        public FeedbackCategory Implementation { get; set; } = new();
                        
                        public class FeedbackCategory
                        {
                            public int Score { get; set; }
                            public string Comments { get; set; } = string.Empty;
                        }
                    }
                }
            }
            
            public class HintChat
            {
                public List<Message> Messages { get; set; } = new List<Message>();
                
                public class Message
                {
                    public string From { get; set; } = string.Empty; // 'user' or 'hint_bot'
                    public string MessageText { get; set; } = string.Empty;
                    public string Timestamp { get; set; } = string.Empty;
                }
            }
        }
    }
}
