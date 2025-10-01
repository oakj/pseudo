using System.Text.Json.Serialization;

namespace PseudoApi.Models.Response
{
    public class UserQuestionDataResponse
    {
        public UserQuestionData? Data { get; set; }
        public string? Error { get; set; }
        
        public class UserQuestionData
        {
            [JsonPropertyName("user_id")]
            public string UserId { get; set; } = string.Empty;
            
            [JsonPropertyName("question_id")]
            public string QuestionId { get; set; } = string.Empty;
            
            [JsonPropertyName("submission")]
            public Submission? SubmissionData { get; set; }
            
            [JsonPropertyName("hint_chat")]
            public HintChat HintChatData { get; set; } = new HintChat();
            
            public class Submission
            {
                [JsonPropertyName("solution")]
                public Solution? Solution { get; set; }
                
                [JsonPropertyName("timestamp")]
                public string? Timestamp { get; set; }
                
                [JsonPropertyName("evaluation")]
                public Evaluation? EvaluationData { get; set; }
            }
            
            public class Solution
            {
                [JsonPropertyName("lines")]
                public List<CodeLine> Lines { get; set; } = new List<CodeLine>();
            }
            
            public class CodeLine
            {
                [JsonPropertyName("number")]
                public int Number { get; set; }
                
                [JsonPropertyName("text")]
                public string Text { get; set; } = string.Empty;
            }
            
            public class Evaluation
            {
                [JsonPropertyName("score")]
                public int Score { get; set; }
                
                [JsonPropertyName("approach_identified")]
                public string? ApproachIdentified { get; set; }
                
                [JsonPropertyName("complexity_analysis")]
                public ComplexityAnalysis? ComplexityAnalysis { get; set; }
                
                [JsonPropertyName("feedback")]
                public Feedback? Feedback { get; set; }
                
                [JsonPropertyName("requirements_met")]
                public List<string> RequirementsMet { get; set; } = new List<string>();
                
                [JsonPropertyName("requirements_missing")]
                public List<string> RequirementsMissing { get; set; } = new List<string>();
            }
            
            public class ComplexityAnalysis
            {
                [JsonPropertyName("time")]
                public string? Time { get; set; }
                
                [JsonPropertyName("space")]
                public string? Space { get; set; }
            }
            
            public class Feedback
            {
                [JsonPropertyName("strengths")]
                public List<string> Strengths { get; set; } = new List<string>();
                
                [JsonPropertyName("improvements")]
                public List<string> Improvements { get; set; } = new List<string>();
            }
            
            public class HintChat
            {
                [JsonPropertyName("messages")]
                public List<Message> Messages { get; set; } = new List<Message>();
            }
            
            public class Message
            {
                [JsonPropertyName("from")]
                public string From { get; set; } = string.Empty;
                
                [JsonPropertyName("message")]
                public string Text { get; set; } = string.Empty;
                
                [JsonPropertyName("timestamp")]
                public string? Timestamp { get; set; }
            }
        }
    }
}
