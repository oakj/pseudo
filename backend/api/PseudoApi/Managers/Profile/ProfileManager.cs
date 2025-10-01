using FluentValidation;
using PseudoApi.Models.Request;
using PseudoApi.Models.Response;
using PseudoApi.Services;
using System.Security.Claims;

namespace PseudoApi.Managers.Profile
{
    public class ProfileManager : ResourceManager
    {
        private readonly IValidator<UpdateProfileRequest> _updateProfileValidator;
        
        public ProfileManager(
            IHttpContextAccessor httpContextAccessor,
            SupabaseService supabaseService,
            IValidator<UpdateProfileRequest> updateProfileValidator)
            : base(httpContextAccessor, supabaseService)
        {
            _updateProfileValidator = updateProfileValidator;
        }
        
        public async Task<ApiResponse<ProfileResponse>> GetProfileAsync()
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("User ID not found in token");
            }
            
            var client = await _supabaseService.GetClientWithUserToken();
            
            // Query the profiles table for the user's profile
            var response = await client.From<Models.DTO.ProfileDto>()
                .Where(p => p.UserId == userId)
                .Get();

            if (!response.ResponseMessage.IsSuccessStatusCode)
            {
                throw new Exception($"Error retrieving profile: {response.ResponseMessage.ReasonPhrase}");
            }

            var profile = response.Models.FirstOrDefault();
            if (profile == null)
            {
                throw new Exception("Profile not found");
            }
            
            return new ApiResponse<ProfileResponse>
            {
                Success = true,
                Data = new ProfileResponse
                {
                    Data = new ProfileResponse.ProfileData
                    {
                        UserId = profile.UserId,
                        Email = profile.Email,
                        AvatarUrl = profile.AvatarUrl,
                        DarkModePreference = profile.DarkModePreference
                    }
                }
            };
        }
        
        public async Task<ApiResponse<ProfileResponse>> UpdateProfileAsync(UpdateProfileRequest request)
        {
            return await ValidateAndProcessAsync(request, _updateProfileValidator, async req =>
            {
                var userId = GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedAccessException("User ID not found in token");
                }
                
                var client = await _supabaseService.GetClientWithUserToken();
                
                // Update the profile in the database
                var response = await client.From<Models.DTO.ProfileDto>()
                    .Where(p => p.UserId == userId)
                    .Set(p => p.AvatarUrl, req.AvatarUrl)
                    .Set(p => p.DarkModePreference, req.DarkModePreference)
                    .Update();

                if (!response.ResponseMessage.IsSuccessStatusCode)
                {
                    throw new Exception($"Error updating profile: {response.ResponseMessage.ReasonPhrase}");
                }

                var profile = response.Models.FirstOrDefault();
                if (profile == null)
                {
                    throw new Exception("Profile not found");
                }
                
                return new ProfileResponse
                {
                    Data = new ProfileResponse.ProfileData
                    {
                        UserId = profile.UserId,
                        Email = profile.Email,
                        AvatarUrl = profile.AvatarUrl,
                        DarkModePreference = profile.DarkModePreference
                    }
                };
            });
        }
    }
}
