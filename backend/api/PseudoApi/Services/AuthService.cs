using Supabase.Gotrue;
using Supabase.Gotrue.Responses;

namespace PseudoApi.Services
{
    public class AuthService
    {
        private readonly SupabaseService _supabaseService;

        public AuthService(SupabaseService supabaseService)
        {
            _supabaseService = supabaseService;
        }

        public async Task<Session> SignInWithEmailAsync(string email, string password)
        {
            try
            {
                var client = await _supabaseService.GetClientWithUserToken();
                var session = await client.Auth.SignIn(email, password);
                return session;
            }
            catch (Exception ex)
            {
                throw new Exception($"Authentication failed: {ex.Message}");
            }
        }

        public async Task<Session> SignUpWithEmailAsync(string email, string password)
        {
            try
            {
                var client = await _supabaseService.GetClientWithUserToken();
                var session = await client.Auth.SignUp(email, password);
                return session;
            }
            catch (Exception ex)
            {
                throw new Exception($"Registration failed: {ex.Message}");
            }
        }

        public async Task SignOutAsync()
        {
            var client = await _supabaseService.GetClientWithUserToken();
            await client.Auth.SignOut();
        }
    }
}
