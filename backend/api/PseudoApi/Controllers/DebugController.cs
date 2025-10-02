using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PseudoApi.Services;
using Supabase;
using System.IdentityModel.Tokens.Jwt;

namespace PseudoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DebugController : ControllerBase
    {
        private readonly SupabaseService _supabaseService;
        private readonly StorageService _storageService;
        private readonly IConfiguration _configuration;
        
        public DebugController(
            SupabaseService supabaseService, 
            StorageService storageService,
            IConfiguration configuration)
        {
            _supabaseService = supabaseService;
            _storageService = storageService;
            _configuration = configuration;
        }
        
        [HttpGet("auth")]
        [Authorize]
        public async Task<IActionResult> TestAuth()
        {
            try
            {
                var result = new Dictionary<string, object>();
                
                // Get JWT token from request
                var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
                result["tokenExists"] = !string.IsNullOrEmpty(token);
                
                if (!string.IsNullOrEmpty(token))
                {
                    // Decode JWT token
                    var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
                    var jwtToken = handler.ReadJwtToken(token);
                    
                    // Get claims
                    var claims = jwtToken.Claims.Select(c => new { c.Type, c.Value }).ToList();
                    result["claims"] = claims;
                    
                    // Get user ID from token
                    var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
                    result["userId"] = userId;
                }
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
        
        [HttpGet("storage")]
        [Authorize]
        public async Task<IActionResult> TestStorage()
        {
            try
            {
                var result = new Dictionary<string, object>();
                
                // Try to list files in storage with user token
                try
                {
                    var client = await _supabaseService.GetClientWithUserToken();
                    var bucket = client.Storage.From("userquestions");
                    var files = await bucket.List();
                    
                    result["userTokenFiles"] = files.Select(f => new { 
                        f.Name, 
                        IsFolder = f.IsFolder
                    }).ToList();
                }
                catch (Exception ex)
                {
                    result["userTokenError"] = ex.Message;
                }
                
                // Try with service role key
                try
                {
                    var url = _configuration["Supabase:Url"];
                    var serviceKey = _configuration["Supabase:ServiceKey"];
                    var options = new SupabaseOptions
                    {
                        AutoRefreshToken = false,
                        AutoConnectRealtime = false
                    };
                    
                    var serviceClient = new Supabase.Client(url, serviceKey, options);
                    await serviceClient.InitializeAsync();
                    
                    // Try to list files
                    var bucket = serviceClient.Storage.From("userquestions");
                    var files = await bucket.List();
                    
                    result["serviceRoleFiles"] = files.Select(f => new { 
                        f.Name, 
                        IsFolder = f.IsFolder
                    }).ToList();
                }
                catch (Exception ex)
                {
                    result["serviceRoleError"] = ex.Message;
                }
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
        
        [HttpGet("rpc")]
        [Authorize]
        public async Task<IActionResult> TestRpc()
        {
            try
            {
                var result = new Dictionary<string, object>();
                
                // Try direct HTTP request to RPC endpoint
                try
                {
                    var url = _configuration["Supabase:Url"];
                    var key = _configuration["Supabase:AnonKey"];
                    
                    // Get the JWT token from the request
                    var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
                    
                    using var httpClient = new HttpClient();
                    httpClient.DefaultRequestHeaders.Add("apikey", key);
                    
                    if (!string.IsNullOrEmpty(token))
                    {
                        httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
                    }
                    
                    var content = new StringContent("{}", System.Text.Encoding.UTF8, "application/json");
                    var response = await httpClient.PostAsync($"{url}/rest/v1/rpc/dev_get_auth_uid", content);
                    
                    result["httpStatus"] = response.StatusCode.ToString();
                    
                    var responseContent = await response.Content.ReadAsStringAsync();
                    result["httpResponse"] = responseContent;
                }
                catch (Exception ex)
                {
                    result["httpError"] = ex.Message;
                }
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}
