using System.ComponentModel.DataAnnotations;

namespace PseudoApi.Models.Request
{
    public class CreateCollectionRequest
    {
        [Required]
        public string CollectionName { get; set; } = string.Empty;
    }
}
