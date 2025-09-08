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
                .Single();
            
            if (existingResult.Error == null && existingResult.Data != null)
            {
                // Return existing streak
                return new ApiResponse<WeeklyStreakResponse>
                {
                    Success = true,
                    Data = new WeeklyStreakResponse
                    {
                        Data = new WeeklyStreakResponse.WeeklyStreak
                        {
                            StreakDays = existingResult.Data.StreakDays,
                            WeekStartUtc = existingResult.Data.WeekStartUtc
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
            
            if (createResult.Error != null)
            {
                throw new Exception($"Error creating streak: {createResult.Error.Message}");
            }
            
            var streak = createResult.Data.FirstOrDefault();
            if (streak == null)
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
                        StreakDays = streak.StreakDays,
                        WeekStartUtc = streak.WeekStartUtc
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
                    .Single();
                
                if (existingResult.Error == null && existingResult.Data != null)
                {
                    // Update existing streak
                    var updateResult = await client.From<StreakDto>()
                        .Where(s => s.StreakId == existingResult.Data.StreakId)
                        .Set(s => s.StreakDays, req.StreakDays)
                        .Update();
                    
                    if (updateResult.Error != null)
                    {
                        throw new Exception($"Error updating streak: {updateResult.Error.Message}");
                    }
                    
                    var streak = updateResult.Data.FirstOrDefault();
                    if (streak == null)
                    {
                        throw new Exception("Failed to update streak");
                    }
                    
                    return new WeeklyStreakResponse
                    {
                        Data = new WeeklyStreakResponse.WeeklyStreak
                        {
                            StreakDays = streak.StreakDays,
                            WeekStartUtc = streak.WeekStartUtc
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
                    
                    if (createResult.Error != null)
                    {
                        throw new Exception($"Error creating streak: {createResult.Error.Message}");
                    }
                    
                    var streak = createResult.Data.FirstOrDefault();
                    if (streak == null)
                    {
                        throw new Exception("Failed to create streak");
                    }
                    
                    return new WeeklyStreakResponse
                    {
                        Data = new WeeklyStreakResponse.WeeklyStreak
                        {
                            StreakDays = streak.StreakDays,
                            WeekStartUtc = streak.WeekStartUtc
                        }
                    };
                }
            });
        }
    }
}
