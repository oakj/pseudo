using System.ComponentModel.DataAnnotations;

namespace PseudoApi.Models.Request
{
    public class SignUpRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [MinLength(8)]
        public string Password { get; set; } = string.Empty;
    }
}
