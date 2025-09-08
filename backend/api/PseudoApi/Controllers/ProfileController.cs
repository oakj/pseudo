using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PseudoApi.Managers.Profile;
using PseudoApi.Models.Request;

namespace PseudoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly ProfileManager _profileManager;
        
        public ProfileController(ProfileManager profileManager)
        {
            _profileManager = profileManager;
        }
        
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var response = await _profileManager.GetProfileAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }
        
        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var response = await _profileManager.UpdateProfileAsync(request);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}
