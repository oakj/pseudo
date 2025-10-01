using FluentValidation;
using PseudoApi.Models.DTO;
using PseudoApi.Models.Request;
using PseudoApi.Models.Response;
using PseudoApi.Services;

namespace PseudoApi.Managers.Streak
{
    public class StreakManager : ResourceManager
    {
        private readonly IValidator<UpdateStreakRequest> _updateStreakValidator;
        
        public StreakManager(
            IHttpContextAccessor httpContextAccessor,
            SupabaseService supabaseService,
            IValidator<UpdateStreakRequest> updateStreakValidator)
            : base(httpContextAccessor, supabaseService)
        {
            _updateStreakValidator = updateStreakValidator;
        }
        
        public async Task<ApiResponse<WeeklyStreakResponse>> GetStreakAsync()
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("User ID not found in token");
            }
            
            var client = await _supabaseService.GetClientWithUserToken();
            
            // Get current week's start date in UTC
            var now = DateTime.UtcNow;
            var currentWeekStart = now.AddDays(-(int)now.DayOfWeek).Date;
            
            // Get or create streak for current week
            var existingResult = await client.From<StreakDto>()
                .Where(s => s.UserId == userId && s.WeekStartUtc == currentWeekStart)
                .Get();

            if (existingResult.ResponseMessage.IsSuccessStatusCode && existingResult.Models.Any())
            {
                // Return existing streak
                var existingStreak = existingResult.Models.First();
                return new ApiResponse<WeeklyStreakResponse>
                {
                    Success = true,
                    Data = new WeeklyStreakResponse
                    {
                        Data = new WeeklyStreakResponse.WeeklyStreak
                        {
                            StreakDays = existingStreak.StreakDays,
                            WeekStartUtc = existingStreak.WeekStartUtc
                        }
                    }
                };
            }
            
            // Create new streak for current week
            var newStreak = new StreakDto
            {
                UserId = userId,
                StreakDays = new List<int>(),
                WeekStartUtc = currentWeekStart
            };
            
            var createResult = await client.From<StreakDto>().Insert(newStreak);
            
            if (!createResult.ResponseMessage.IsSuccessStatusCode)
            {
                throw new Exception($"Error creating streak: {createResult.ResponseMessage.ReasonPhrase}");
            }
            
            var createdStreak = createResult.Models.FirstOrDefault();
            if (createdStreak == null)
            {
                throw new Exception("Failed to create streak");
            }
            
            return new ApiResponse<WeeklyStreakResponse>
            {
                Success = true,
                Data = new WeeklyStreakResponse
                {
                    Data = new WeeklyStreakResponse.WeeklyStreak
                    {
                        StreakDays = createdStreak.StreakDays,
                        WeekStartUtc = createdStreak.WeekStartUtc
                    }
                }
            };
        }
        
        public async Task<ApiResponse<WeeklyStreakResponse>> UpdateStreakAsync(UpdateStreakRequest request)
        {
            return await ValidateAndProcessAsync(request, _updateStreakValidator, async req =>
            {
                var userId = GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedAccessException("User ID not found in token");
                }
                
                var client = await _supabaseService.GetClientWithUserToken();
                
                // Get current week's start date in UTC
                var now = DateTime.UtcNow;
                var currentWeekStart = now.AddDays(-(int)now.DayOfWeek).Date;
                
                // Get or create streak for current week
                var existingResult = await client.From<StreakDto>()
                    .Where(s => s.UserId == userId && s.WeekStartUtc == currentWeekStart)
                    .Get();

                if (existingResult.ResponseMessage.IsSuccessStatusCode && existingResult.Models.Any())
                {
                    // Update existing streak
                    var existingStreak = existingResult.Models.First();
                    var updateResult = await client.From<StreakDto>()
                        .Where(s => s.StreakId == existingStreak.StreakId)
                        .Set(s => s.StreakDays, req.StreakDays)
                        .Update();
                    
                    if (!updateResult.ResponseMessage.IsSuccessStatusCode)
                    {
                        throw new Exception($"Error updating streak: {updateResult.ResponseMessage.ReasonPhrase}");
                    }
                    
                    var updatedStreak = updateResult.Models.FirstOrDefault();
                    if (updatedStreak == null)
                    {
                        throw new Exception("Failed to update streak");
                    }
                    
                    return new WeeklyStreakResponse
                    {
                        Data = new WeeklyStreakResponse.WeeklyStreak
                        {
                            StreakDays = updatedStreak.StreakDays,
                            WeekStartUtc = updatedStreak.WeekStartUtc
                        }
                    };
                }
                else
                {
                    // Create new streak for current week
                    var newStreak = new StreakDto
                    {
                        UserId = userId,
                        StreakDays = req.StreakDays,
                        WeekStartUtc = currentWeekStart
                    };
                    
                    var createResult = await client.From<StreakDto>().Insert(newStreak);
                    
                    if (!createResult.ResponseMessage.IsSuccessStatusCode)
                    {
                        throw new Exception($"Error creating streak: {createResult.ResponseMessage.ReasonPhrase}");
                    }
                    
                    var createdStreak = createResult.Models.FirstOrDefault();
                    if (createdStreak == null)
                    {
                        throw new Exception("Failed to create streak");
                    }
                    
                    return new WeeklyStreakResponse
                    {
                        Data = new WeeklyStreakResponse.WeeklyStreak
                        {
                            StreakDays = createdStreak.StreakDays,
                            WeekStartUtc = createdStreak.WeekStartUtc
                        }
                    };
                }
            });
        }
    }
}
