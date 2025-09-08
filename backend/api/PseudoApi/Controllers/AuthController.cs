using Microsoft.AspNetCore.Mvc;
using PseudoApi.Managers.Auth;
using PseudoApi.Models.Request;

namespace PseudoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthManager _authManager;
        
        public AuthController(AuthManager authManager)
        {
            _authManager = authManager;
        }
        
        [HttpPost("signin")]
        public async Task<IActionResult> SignIn([FromBody] SignInRequest request)
        {
            var response = await _authManager.SignInAsync(request);
            return response.Success ? Ok(response) : BadRequest(response);
        }
        
        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] SignUpRequest request)
        {
            var response = await _authManager.SignUpAsync(request);
            return response.Success ? Ok(response) : BadRequest(response);
        }
        
        [HttpPost("signout")]
        public new async Task<IActionResult> SignOut()
        {
            var response = await _authManager.SignOutAsync();
            return Ok(response);
        }
    }
}
