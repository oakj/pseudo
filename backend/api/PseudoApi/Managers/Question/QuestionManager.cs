using FluentValidation;
using PseudoApi.Models.DTO;
using PseudoApi.Models.Request;
using PseudoApi.Models.Response;
using PseudoApi.Services;
using System.Text.Json;

namespace PseudoApi.Managers.Question
{
    public class QuestionManager : ResourceManager
    {
        private readonly StorageService _storageService;
        private readonly IValidator<GetQuestionRequest> _getQuestionValidator;
        
        public QuestionManager(
            IHttpContextAccessor httpContextAccessor,
            SupabaseService supabaseService,
            StorageService storageService,
            IValidator<GetQuestionRequest> getQuestionValidator)
            : base(httpContextAccessor, supabaseService)
        {
            _storageService = storageService;
            _getQuestionValidator = getQuestionValidator;
        }
        
        public async Task<ApiResponse<QuestionResponse>> GetQuestionsAsync()
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("User ID not found in token");
            }
            
            var client = await _supabaseService.GetClientWithUserToken();
            
            // Call Supabase RPC function
            var result = await client.Rpc<List<QuestionDto>>("selectquestionsbyuserid", new Dictionary<string, object>
            {
                { "p_user_id", userId }
            });
            
            if (result.Error != null)
            {
                throw new Exception($"Error calling Supabase: {result.Error.Message}");
            }
            
            // Map to response
            return new ApiResponse<QuestionResponse>
            {
                Success = true,
                Data = new QuestionResponse
                {
                    Data = result.Data?.Select(q => new QuestionResponse.Question
                    {
                        QuestionId = q.QuestionId,
                        Title = q.Title,
                        Difficulty = q.Difficulty,
                        IsSolved = q.IsSolved,
                        DesignPatterns = q.DesignPatterns
                    }).ToList()
                }
            };
        }
        
        public async Task<ApiResponse<QuestionResponse>> GetQuestionByIdAsync(GetQuestionRequest request)
        {
            return await ValidateAndProcessAsync(request, _getQuestionValidator, async req =>
            {
                var userId = GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedAccessException("User ID not found in token");
                }
                
                var client = await _supabaseService.GetClientWithUserToken();
                
                // Get question by ID
                var result = await client.From<QuestionDto>()
                    .Where(q => q.QuestionId == req.QuestionId)
                    .Single();
                
                if (result.Error != null)
                {
                    throw new Exception($"Error retrieving question: {result.Error.Message}");
                }
                
                var question = result.Data;
                
                return new QuestionResponse
                {
                    Data = new List<QuestionResponse.Question>
                    {
                        new QuestionResponse.Question
                        {
                            QuestionId = question.QuestionId,
                            Title = question.Title,
                            Difficulty = question.Difficulty,
                            IsSolved = question.IsSolved,
                            DesignPatterns = question.DesignPatterns
                        }
                    }
                };
            });
        }
        
        public async Task<ApiResponse<QuestionDataResponse>> GetQuestionDataAsync(GetQuestionRequest request)
        {
            return await ValidateAndProcessAsync(request, _getQuestionValidator, async req =>
            {
                // Download question data from storage
                var stream = await _storageService.DownloadFileAsync("questions", $"{req.QuestionId}.json");
                
                using var reader = new StreamReader(stream);
                var json = await reader.ReadToEndAsync();
                
                var questionData = JsonSerializer.Deserialize<QuestionDataResponse.QuestionData>(json, 
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                
                if (questionData == null)
                {
                    throw new Exception("Failed to deserialize question data");
                }
                
                return new QuestionDataResponse
                {
                    Data = questionData
                };
            });
        }
    }
}
