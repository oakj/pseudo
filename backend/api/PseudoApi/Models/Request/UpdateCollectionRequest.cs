using System.ComponentModel.DataAnnotations;

namespace PseudoApi.Models.Request
{
    public class UpdateCollectionRequest
    {
        [Required]
        public string CollectionName { get; set; } = string.Empty;
    }
}
