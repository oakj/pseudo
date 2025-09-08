using System.ComponentModel.DataAnnotations;

namespace PseudoApi.Models.Request
{
    public class UpdateStreakRequest
    {
        [Required]
        public List<int> StreakDays { get; set; } = new List<int>();
    }
}
