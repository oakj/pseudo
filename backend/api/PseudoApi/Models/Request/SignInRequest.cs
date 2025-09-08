using System.ComponentModel.DataAnnotations;

namespace PseudoApi.Models.Request
{
    public class SignInRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
