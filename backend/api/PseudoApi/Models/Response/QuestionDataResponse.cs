namespace PseudoApi.Models.Response
{
    public class QuestionDataResponse
    {
        public QuestionData? Data { get; set; }
        public string? Error { get; set; }
        
        public class QuestionData
        {
            public string Description { get; set; } = string.Empty;
            public List<string> Constraints { get; set; } = new List<string>();
            public BoilerplateSolution BoilerplateInfo { get; set; } = new();
            public List<string> Hints { get; set; } = new List<string>();
            
            public class BoilerplateSolution
            {
                public string Language { get; set; } = string.Empty;
                public string Pseudocode { get; set; } = string.Empty;
            }
        }
    }
}
