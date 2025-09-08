using System.ComponentModel.DataAnnotations;
using PseudoApi.Models.Response;

namespace PseudoApi.Models.Request
{
    public class UpdateUserQuestionDataRequest
    {
        [Required]
        public string UserQuestionId { get; set; } = string.Empty;
        
        [Required]
        public UserQuestionDataResponse.UserQuestionData Data { get; set; } = new();
    }
}
