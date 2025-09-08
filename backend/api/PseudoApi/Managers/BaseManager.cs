using FluentValidation;
using PseudoApi.Models.Response;
using PseudoApi.Services;
using System.Diagnostics;

namespace PseudoApi.Managers
{
    // Keep the original interface and base class for backward compatibility
    public interface IManager<TRequest, TResponse> where TResponse : class
    {
        Task<ApiResponse<TResponse>> HandleAsync(TRequest request);
    }

    public abstract class BaseManager<TRequest, TResponse> : IManager<TRequest, TResponse>
        where TResponse : class
    {
        protected readonly IValidator<TRequest> _validator;
        
        protected BaseManager(IValidator<TRequest> validator)
        {
            _validator = validator;
        }
        
        public async Task<ApiResponse<TResponse>> HandleAsync(TRequest request)
        {
            // Validate request
            var validationResult = await _validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return new ApiResponse<TResponse>
                {
                    Success = false,
                    Error = "Validation failed",
                    ErrorCode = "VALIDATION_ERROR",
                    ValidationErrors = validationResult.Errors.Select(e => new ValidationError
                    {
                        PropertyName = e.PropertyName,
                        ErrorMessage = e.ErrorMessage
                    }).ToList()
                };
            }
            
            // Process request
            try
            {
                var result = await ProcessRequestAsync(request);
                return new ApiResponse<TResponse>
                {
                    Success = true,
                    Data = result
                };
            }
            catch (Exception ex)
            {
                return HandleException<TResponse>(ex);
            }
        }
        
        protected abstract Task<TResponse> ProcessRequestAsync(TRequest request);
        
        protected ApiResponse<T> HandleException<T>(Exception ex) where T : class
        {
            // Log exception
            
            return new ApiResponse<T>
            {
                Success = false,
                Error = "An error occurred while processing your request",
                ErrorCode = "INTERNAL_SERVER_ERROR",
                TraceId = Activity.Current?.Id ?? "unknown"
            };
        }
    }

    /// <summary>
    /// Base class for consolidated resource managers that handle multiple operations on a resource
    /// </summary>
    public abstract class ResourceManager
    {
        protected readonly IHttpContextAccessor _httpContextAccessor;
        protected readonly SupabaseService _supabaseService;
        
        protected ResourceManager(
            IHttpContextAccessor httpContextAccessor,
            SupabaseService supabaseService)
        {
            _httpContextAccessor = httpContextAccessor;
            _supabaseService = supabaseService;
        }
        
        protected string? GetUserId()
        {
            return _httpContextAccessor.HttpContext?.Items["UserId"] as string;
        }
        
        protected async Task<ApiResponse<TResponse>> ValidateAndProcessAsync<TRequest, TResponse>(
            TRequest request, 
            IValidator<TRequest> validator,
            Func<TRequest, Task<TResponse>> processor) 
            where TResponse : class
        {
            // Validate request
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return new ApiResponse<TResponse>
                {
                    Success = false,
                    Error = "Validation failed",
                    ErrorCode = "VALIDATION_ERROR",
                    ValidationErrors = validationResult.Errors.Select(e => new ValidationError
                    {
                        PropertyName = e.PropertyName,
                        ErrorMessage = e.ErrorMessage
                    }).ToList()
                };
            }
            
            // Process request
            try
            {
                var result = await processor(request);
                return new ApiResponse<TResponse>
                {
                    Success = true,
                    Data = result
                };
            }
            catch (Exception ex)
            {
                return HandleException<TResponse>(ex);
            }
        }
        
        protected ApiResponse<T> HandleException<T>(Exception ex) where T : class
        {
            // Log exception
            
            return new ApiResponse<T>
            {
                Success = false,
                Error = "An error occurred while processing your request",
                ErrorCode = "INTERNAL_SERVER_ERROR",
                TraceId = Activity.Current?.Id ?? _httpContextAccessor.HttpContext?.TraceIdentifier ?? "unknown"
            };
        }
    }
}
