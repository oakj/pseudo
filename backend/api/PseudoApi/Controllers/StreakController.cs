using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PseudoApi.Managers.Streak;
using PseudoApi.Models.Request;

namespace PseudoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StreakController : ControllerBase
    {
        private readonly StreakManager _streakManager;
        
        public StreakController(StreakManager streakManager)
        {
            _streakManager = streakManager;
        }
        
        [HttpGet]
        public async Task<IActionResult> GetStreak()
        {
            var response = await _streakManager.GetStreakAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }
        
        [HttpPut]
        public async Task<IActionResult> UpdateStreak([FromBody] UpdateStreakRequest request)
        {
            var response = await _streakManager.UpdateStreakAsync(request);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}
