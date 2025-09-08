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
            var client = await _supabaseService.GetClientWithUserToken();
            var response = await client.Auth.SignIn(email, password);
            
            if (response.Error != null)
            {
                throw new Exception($"Authentication failed: {response.Error.Message}");
            }
            
            return response;
        }

        public async Task<Session> SignUpWithEmailAsync(string email, string password)
        {
            var client = await _supabaseService.GetClientWithUserToken();
            var response = await client.Auth.SignUp(email, password);
            
            if (response.Error != null)
            {
                throw new Exception($"Registration failed: {response.Error.Message}");
            }
            
            return response;
        }

        public async Task SignOutAsync()
        {
            var client = await _supabaseService.GetClientWithUserToken();
            await client.Auth.SignOut();
        }
    }
}
