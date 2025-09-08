namespace PseudoApi.Models.Response
{
    public class AuthResponse
    {
        public UserData? Data { get; set; }
        public string? Error { get; set; }
        
        public class UserData
        {
            public User? User { get; set; }
            public string? AccessToken { get; set; }
            public string? RefreshToken { get; set; }
        }
        
        public class User
        {
            public string Id { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
        }
    }
}
