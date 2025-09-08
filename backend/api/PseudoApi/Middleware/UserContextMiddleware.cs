using System.Security.Claims;

namespace PseudoApi.Middleware
{
    public class UserContextMiddleware
    {
        private readonly RequestDelegate _next;

        public UserContextMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.User.Identity?.IsAuthenticated == true)
            {
                // Extract user ID from claims
                var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                
                if (!string.IsNullOrEmpty(userId))
                {
                    // Add user ID to HttpContext.Items for easy access in controllers
                    context.Items["UserId"] = userId;
                }
            }

            await _next(context);
        }
    }
}
