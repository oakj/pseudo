using Supabase;

namespace PseudoApi.Services
{
    public class SupabaseService
    {
        private readonly Client _client;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SupabaseService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            var url = configuration["Supabase:Url"];
            var key = configuration["Supabase:AnonKey"];
            var options = new SupabaseOptions
            {
                AutoRefreshToken = true,
                AutoConnectRealtime = false
            };
            _client = new Client(url, key, options);
        }

        public async Task<Client> GetClientWithUserToken()
        {
            var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"]
                .FirstOrDefault()?.Split(" ").Last();
            
            if (!string.IsNullOrEmpty(token))
            {
                await _client.Auth.SetAuth(token);
            }
            
            return _client;
        }
    }
}
