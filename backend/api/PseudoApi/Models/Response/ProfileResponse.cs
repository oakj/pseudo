namespace PseudoApi.Models.Response
{
    public class ProfileResponse
    {
        public ProfileData? Data { get; set; }
        public string? Error { get; set; }
        
        public class ProfileData
        {
            public string UserId { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string? AvatarUrl { get; set; }
            public string DarkModePreference { get; set; } = string.Empty;
        }
    }
}
