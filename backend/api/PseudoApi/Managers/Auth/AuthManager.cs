using FluentValidation;
using PseudoApi.Models.Request;
using PseudoApi.Models.Response;
using PseudoApi.Services;
using Supabase.Gotrue;

namespace PseudoApi.Managers.Auth
{
    public class AuthManager : ResourceManager
    {
        private readonly AuthService _authService;
        private readonly IValidator<SignInRequest> _signInValidator;
        private readonly IValidator<SignUpRequest> _signUpValidator;
        
        public AuthManager(
            IHttpContextAccessor httpContextAccessor,
            SupabaseService supabaseService,
            AuthService authService,
            IValidator<SignInRequest> signInValidator,
            IValidator<SignUpRequest> signUpValidator) 
            : base(httpContextAccessor, supabaseService)
        {
            _authService = authService;
            _signInValidator = signInValidator;
            _signUpValidator = signUpValidator;
        }
        
        public async Task<ApiResponse<AuthResponse>> SignInAsync(SignInRequest request)
        {
            return await ValidateAndProcessAsync(request, _signInValidator, async req =>
            {
                var session = await _authService.SignInWithEmailAsync(req.Email, req.Password);
                
                return new AuthResponse
                {
                    Data = new AuthResponse.UserData
                    {
                        User = new AuthResponse.User
                        {
                            Id = session.User.Id,
                            Email = session.User.Email
                        },
                        AccessToken = session.AccessToken,
                        RefreshToken = session.RefreshToken
                    }
                };
            });
        }
        
        public async Task<ApiResponse<AuthResponse>> SignUpAsync(SignUpRequest request)
        {
            return await ValidateAndProcessAsync(request, _signUpValidator, async req =>
            {
                var session = await _authService.SignUpWithEmailAsync(req.Email, req.Password);
                
                return new AuthResponse
                {
                    Data = new AuthResponse.UserData
                    {
                        User = new AuthResponse.User
                        {
                            Id = session.User.Id,
                            Email = session.User.Email
                        },
                        AccessToken = session.AccessToken,
                        RefreshToken = session.RefreshToken
                    }
                };
            });
        }
        
        public async Task<ApiResponse<object>> SignOutAsync()
        {
            await _authService.SignOutAsync();
            return new ApiResponse<object>
            {
                Success = true,
                Data = new { Message = "Successfully signed out" }
            };
        }
    }
}
