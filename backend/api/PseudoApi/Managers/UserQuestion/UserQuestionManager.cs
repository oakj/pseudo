using FluentValidation;
using PseudoApi.Models.DTO;
using PseudoApi.Models.Request;
using PseudoApi.Models.Response;
using PseudoApi.Services;
using System.Text.Json;

namespace PseudoApi.Managers.UserQuestion
{
    public class UserQuestionManager : ResourceManager
    {
        private readonly StorageService _storageService;
        private readonly IValidator<GetUserQuestionRequest> _getUserQuestionValidator;
        private readonly IValidator<GetUserQuestionDataRequest> _getUserQuestionDataValidator;
        private readonly IValidator<UpdateUserQuestionDataRequest> _updateUserQuestionDataValidator;
        
        public UserQuestionManager(
            IHttpContextAccessor httpContextAccessor,
            SupabaseService supabaseService,
            StorageService storageService,
            IValidator<GetUserQuestionRequest> getUserQuestionValidator,
            IValidator<GetUserQuestionDataRequest> getUserQuestionDataValidator,
            IValidator<UpdateUserQuestionDataRequest> updateUserQuestionDataValidator)
            : base(httpContextAccessor, supabaseService)
        {
            _storageService = storageService;
            _getUserQuestionValidator = getUserQuestionValidator;
            _getUserQuestionDataValidator = getUserQuestionDataValidator;
            _updateUserQuestionDataValidator = updateUserQuestionDataValidator;
        }
        
        public async Task<ApiResponse<UserQuestionResponse>> GetUserQuestionAsync(GetUserQuestionRequest request)
        {
            return await ValidateAndProcessAsync(request, _getUserQuestionValidator, async req =>
            {
                var userId = GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedAccessException("User ID not found in token");
                }

                var client = await _supabaseService.GetClientWithUserToken();

                // Get or create user question
                var existingResult = await client.From<UserQuestionDto>()
                    .Where(uq => uq.UserId == userId && uq.QuestionId == req.QuestionId)
                    .Get();
                
                if (existingResult.ResponseMessage.IsSuccessStatusCode && existingResult.Models.Any())
                {
                    // Return existing user question
                    var existingUserQuestion = existingResult.Models.First();
                    return new UserQuestionResponse
                    {
                        Data = new UserQuestionResponse.UserQuestion
                        {
                            UserQuestionId = existingUserQuestion.UserQuestionId,
                            QuestionId = existingUserQuestion.QuestionId,
                            UserId = existingUserQuestion.UserId,
                            Solved = existingUserQuestion.Solved
                        }
                    };
                }
                
                // Create new user question
                var newUserQuestion = new UserQuestionDto
                {
                    QuestionId = req.QuestionId,
                    UserId = userId,
                    Solved = false
                };
                
                var createResult = await client.From<UserQuestionDto>().Insert(newUserQuestion);
                
                if (!createResult.ResponseMessage.IsSuccessStatusCode)
                {
                    throw new Exception($"Error creating user question: {createResult.ResponseMessage.ReasonPhrase}");
                }
                
                var userQuestion = createResult.Models.FirstOrDefault();
                if (userQuestion == null)
                {
                    throw new Exception("Failed to create user question");
                }
                
                // Initialize empty user question data in storage
                var emptyData = new UserQuestionDataResponse.UserQuestionData
                {
                    UserId = userId,
                    QuestionId = req.QuestionId,
                    HintChatData = new UserQuestionDataResponse.UserQuestionData.HintChat
                    {
                        Messages = new List<UserQuestionDataResponse.UserQuestionData.Message>()
                    }
                };
                
                var json = JsonSerializer.Serialize(emptyData);
                using var stream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(json));
                
                await _storageService.UploadFileAsync("userquestions", $"{userId}/{userQuestion.UserQuestionId}.json", stream);
                
                return new UserQuestionResponse
                {
                    Data = new UserQuestionResponse.UserQuestion
                    {
                        UserQuestionId = userQuestion.UserQuestionId,
                        QuestionId = userQuestion.QuestionId,
                        UserId = userQuestion.UserId,
                        Solved = userQuestion.Solved
                    }
                };
            });
        }
        
        public async Task<ApiResponse<UserQuestionDataResponse>> GetUserQuestionDataAsync(GetUserQuestionDataRequest request)
        {
            return await ValidateAndProcessAsync(request, _getUserQuestionDataValidator, async req =>
            {
                var userId = GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedAccessException("User ID not found in token");
                }
                
                // Verify ownership of the user question
                var client = await _supabaseService.GetClientWithUserToken();
                var verifyResult = await client.From<UserQuestionDto>()
                    .Where(uq => uq.UserQuestionId == req.UserQuestionId && uq.UserId == userId)
                    .Get();
                
                if (!verifyResult.ResponseMessage.IsSuccessStatusCode || !verifyResult.Models.Any())
                {
                    throw new UnauthorizedAccessException("User question not found or you do not have permission to access it");
                }
                
                // Download user question data from storage
                var stream = await _storageService.DownloadFileAsync("userquestions", $"{userId}/{req.UserQuestionId}.json");
                
                using var reader = new StreamReader(stream);
                var json = await reader.ReadToEndAsync();
                
                var userQuestionData = JsonSerializer.Deserialize<UserQuestionDataResponse.UserQuestionData>(json, 
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                
                if (userQuestionData == null)
                {
                    throw new Exception("Failed to deserialize user question data");
                }
                
                return new UserQuestionDataResponse
                {
                    Data = userQuestionData
                };
            });
        }
        
        public async Task<ApiResponse<UserQuestionDataResponse>> UpdateUserQuestionDataAsync(UpdateUserQuestionDataRequest request)
        {
            return await ValidateAndProcessAsync(request, _updateUserQuestionDataValidator, async req =>
            {
                var userId = GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedAccessException("User ID not found in token");
                }
                
                // Verify ownership of the user question
                var client = await _supabaseService.GetClientWithUserToken();
                var verifyResult = await client.From<UserQuestionDto>()
                    .Where(uq => uq.UserQuestionId == req.UserQuestionId && uq.UserId == userId)
                    .Get();
                
                if (!verifyResult.ResponseMessage.IsSuccessStatusCode || !verifyResult.Models.Any())
                {
                    throw new UnauthorizedAccessException("User question not found or you do not have permission to update it");
                }
                
                // Check if the solution is being submitted/evaluated
                var userQuestion = verifyResult.Models.First();
                var isNowSolved = req.Data.SubmissionData?.EvaluationData != null && !userQuestion.Solved;
                
                if (isNowSolved)
                {
                    // Update the solved status in the database
                    var updateResult = await client.From<UserQuestionDto>()
                        .Where(uq => uq.UserQuestionId == req.UserQuestionId)
                        .Set(uq => uq.Solved, true)
                        .Update();
                    
                    if (!updateResult.ResponseMessage.IsSuccessStatusCode)
                    {
                        throw new Exception($"Error updating user question: {updateResult.ResponseMessage.ReasonPhrase}");
                    }
                }
                
                // Upload updated user question data to storage
                var json = JsonSerializer.Serialize(req.Data);
                using var stream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(json));
                
                await _storageService.UploadFileAsync("userquestions", $"{userId}/{req.UserQuestionId}.json", stream);
                
                return new UserQuestionDataResponse
                {
                    Data = req.Data
                };
            });
        }
    }
}
