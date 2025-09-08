using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PseudoApi.Managers.Question;
using PseudoApi.Models.Request;

namespace PseudoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class QuestionController : ControllerBase
    {
        private readonly QuestionManager _questionManager;
        
        public QuestionController(QuestionManager questionManager)
        {
            _questionManager = questionManager;
        }
        
        [HttpGet]
        public async Task<IActionResult> GetQuestions()
        {
            var response = await _questionManager.GetQuestionsAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuestionById(string id)
        {
            var request = new GetQuestionRequest { QuestionId = id };
            var response = await _questionManager.GetQuestionByIdAsync(request);
            return response.Success ? Ok(response) : BadRequest(response);
        }
        
        [HttpGet("data/{id}")]
        public async Task<IActionResult> GetQuestionData(string id)
        {
            var request = new GetQuestionRequest { QuestionId = id };
            var response = await _questionManager.GetQuestionDataAsync(request);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}
