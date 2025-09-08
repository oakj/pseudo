namespace PseudoApi.Models.Response
{
    public class CollectionResponse
    {
        public List<Collection>? Data { get; set; }
        public string? Error { get; set; }
        
        public class Collection
        {
            public string CollectionId { get; set; } = string.Empty;
            public string CollectionName { get; set; } = string.Empty;
            public bool IsDefault { get; set; }
        }
    }
}
