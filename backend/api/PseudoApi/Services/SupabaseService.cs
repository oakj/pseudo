using Supabase;
using Supabase.Gotrue;
using System.IdentityModel.Tokens.Jwt;

namespace PseudoApi.Services
{
    /*
     * SupabaseService is used for AuthService (via Supabase) and some database calls
     * Supabase http client is used for Storage (blob buckets) due to auth and RLS limitations with the client
     */
    public class SupabaseService
    {
        private readonly Supabase.Client _client;
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
            _client = new Supabase.Client(url, key, options);
        }
        public async Task<Supabase.Client> GetClientWithUserToken()
        {
            var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"]
                .FirstOrDefault()?.Split(" ").Last();
            
            if (!string.IsNullOrEmpty(token))
            {
                // For Supabase v1.1.1, we need to initialize the client first
                await _client.InitializeAsync();
                
                // Debug: Decode and log JWT token
                // DebugLogJwtToken(token);
                
                // In Supabase 1.1.1, SetSession requires accessToken, refreshToken, and a boolean
                // Since we only have the access token, we'll use an empty string for refreshToken
                // and false for the third parameter (which likely controls token refresh behavior)
                _client.Auth.SetSession(token, "", false);
            }
            
            return _client;
        }

        private void DebugLogJwtToken(string token)
        {
            try
            {
                // Try to decode the token to see the user ID
                var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);
                
                // Print all claims for debugging
                Console.WriteLine("JWT Claims:");
                foreach (var claim in jwtToken.Claims)
                {
                    Console.WriteLine($"  {claim.Type}: {claim.Value}");
                }
                
                // The sub claim typically contains the user ID
                var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
                Console.WriteLine($"Token user ID (sub claim): {userId}");
                
                // Check if there's an explicit user ID claim
                var explicitUserId = jwtToken.Claims.FirstOrDefault(c => c.Type == "user_id" || c.Type == "uid")?.Value;
                if (!string.IsNullOrEmpty(explicitUserId))
                {
                    Console.WriteLine($"Explicit user ID claim: {explicitUserId}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error decoding JWT: {ex.Message}");
            }
        }
    }
}
