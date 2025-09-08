using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PseudoApi.Managers.UserQuestion;
using PseudoApi.Models.Request;

namespace PseudoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserQuestionController : ControllerBase
    {
        private readonly UserQuestionManager _userQuestionManager;
        
        public UserQuestionController(UserQuestionManager userQuestionManager)
        {
            _userQuestionManager = userQuestionManager;
        }
        
        [HttpGet("{questionId}")]
        public async Task<IActionResult> GetUserQuestion(string questionId)
        {
            var request = new GetUserQuestionRequest { QuestionId = questionId };
            var response = await _userQuestionManager.GetUserQuestionAsync(request);
            return response.Success ? Ok(response) : BadRequest(response);
        }
        
        [HttpGet("data/{userQuestionId}")]
        public async Task<IActionResult> GetUserQuestionData(string userQuestionId)
        {
            var request = new GetUserQuestionDataRequest { UserQuestionId = userQuestionId };
            var response = await _userQuestionManager.GetUserQuestionDataAsync(request);
            return response.Success ? Ok(response) : BadRequest(response);
        }
        
        [HttpPut("data")]
        public async Task<IActionResult> UpdateUserQuestionData([FromBody] UpdateUserQuestionDataRequest request)
        {
            var response = await _userQuestionManager.UpdateUserQuestionDataAsync(request);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}
