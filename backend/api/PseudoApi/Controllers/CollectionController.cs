using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PseudoApi.Managers.Collection;
using PseudoApi.Models.Request;

namespace PseudoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CollectionController : ControllerBase
    {
        private readonly CollectionManager _collectionManager;
        
        public CollectionController(CollectionManager collectionManager)
        {
            _collectionManager = collectionManager;
        }
        
        [HttpGet]
        public async Task<IActionResult> GetCollections()
        {
            var response = await _collectionManager.GetCollectionsAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCollectionById(string id)
        {
            var request = new GetCollectionRequest { CollectionId = id };
            var response = await _collectionManager.GetCollectionByIdAsync(request);
            return response.Success ? Ok(response) : BadRequest(response);
        }
        
        [HttpPost]
        public async Task<IActionResult> CreateCollection([FromBody] CreateCollectionRequest request)
        {
            var response = await _collectionManager.CreateCollectionAsync(request);
            return response.Success ? Ok(response) : BadRequest(response);
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCollection(string id, [FromBody] UpdateCollectionRequest request)
        {
            var response = await _collectionManager.UpdateCollectionAsync(id, request);
            return response.Success ? Ok(response) : BadRequest(response);
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCollection(string id)
        {
            var response = await _collectionManager.DeleteCollectionAsync(id);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}
