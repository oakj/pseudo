namespace PseudoApi.Models.Response
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string? Error { get; set; }
        public string? ErrorCode { get; set; }
        public string? TraceId { get; set; }
        public List<ValidationError>? ValidationErrors { get; set; }
    }

    public class ValidationError
    {
        public string PropertyName { get; set; } = string.Empty;
        public string ErrorMessage { get; set; } = string.Empty;
    }
}
