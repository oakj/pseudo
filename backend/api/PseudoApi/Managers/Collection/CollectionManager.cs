using FluentValidation;
using PseudoApi.Models.DTO;
using PseudoApi.Models.Request;
using PseudoApi.Models.Response;
using PseudoApi.Services;

namespace PseudoApi.Managers.Collection
{
    public class CollectionManager : ResourceManager
    {
        private readonly IValidator<CreateCollectionRequest> _createCollectionValidator;
        private readonly IValidator<UpdateCollectionRequest> _updateCollectionValidator;
        private readonly IValidator<GetCollectionRequest> _getCollectionValidator;
        
        public CollectionManager(
            IHttpContextAccessor httpContextAccessor,
            SupabaseService supabaseService,
            IValidator<CreateCollectionRequest> createCollectionValidator,
            IValidator<UpdateCollectionRequest> updateCollectionValidator,
            IValidator<GetCollectionRequest> getCollectionValidator)
            : base(httpContextAccessor, supabaseService)
        {
            _createCollectionValidator = createCollectionValidator;
            _updateCollectionValidator = updateCollectionValidator;
            _getCollectionValidator = getCollectionValidator;
        }
        
        public async Task<ApiResponse<CollectionResponse>> GetCollectionsAsync()
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("User ID not found in token");
            }
            
            var client = await _supabaseService.GetClientWithUserToken();
            
            // Call Supabase RPC function
            var result = await client.Rpc("selectcollectionsbyuserid", new Dictionary<string, object>
            {
                { "p_user_id", userId }
            });
            
            // Check for errors in the response
            if (!result.ResponseMessage.IsSuccessStatusCode)
            {
                throw new Exception($"Error calling Supabase: {result.ResponseMessage.ReasonPhrase}");
            }
            
            // Deserialize the response manually
            var collections = Newtonsoft.Json.JsonConvert.DeserializeObject<List<CollectionDto>>(
                result.Content
            );
            
            // Map to response
            return new ApiResponse<CollectionResponse>
            {
                Success = true,
                Data = new CollectionResponse
                {
                    Data = collections?.Select(c => new CollectionResponse.Collection
                    {
                        CollectionId = c.CollectionId,
                        CollectionName = c.CollectionName,
                        IsDefault = c.IsDefault
                    }).ToList()
                }
            };
        }
        
        public async Task<ApiResponse<CollectionDetailResponse>> GetCollectionByIdAsync(GetCollectionRequest request)
        {
            return await ValidateAndProcessAsync(request, _getCollectionValidator, async req =>
            {
                var userId = GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedAccessException("User ID not found in token");
                }
                
                var client = await _supabaseService.GetClientWithUserToken();
                
                // Call Supabase RPC function
                var result = await client.Rpc("selectcollectionbyid", new Dictionary<string, object>
                {
                    { "p_collection_id", req.CollectionId },
                    { "p_user_id", userId }
                });
                
                // Check for errors in the response
                if (!result.ResponseMessage.IsSuccessStatusCode)
                {
                    throw new Exception($"Error calling Supabase: {result.ResponseMessage.ReasonPhrase}");
                }
                
                // Deserialize the response manually
                var collectionQuestion = Newtonsoft.Json.JsonConvert.DeserializeObject<CollectionDetailResponse.CollectionQuestion>(
                    result.Content
                );
                
                return new CollectionDetailResponse
                {
                    Data = collectionQuestion
                };
            });
        }
        
        public async Task<ApiResponse<CollectionResponse>> CreateCollectionAsync(CreateCollectionRequest request)
        {
            return await ValidateAndProcessAsync(request, _createCollectionValidator, async req =>
            {
                var userId = GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedAccessException("User ID not found in token");
                }
                
                var client = await _supabaseService.GetClientWithUserToken();
                
                // Create new collection
                var newCollection = new CollectionDto
                {
                    CollectionName = req.CollectionName,
                    UserId = userId,
                    IsDefault = false
                };
                
                var result = await client.From<CollectionDto>().Insert(newCollection);
                
                if (!result.ResponseMessage.IsSuccessStatusCode)
                {
                    throw new Exception($"Error creating collection: {result.ResponseMessage.ReasonPhrase}");
                }
                
                var collection = result.Models.FirstOrDefault();
                if (collection == null)
                {
                    throw new Exception("Failed to create collection");
                }
                
                return new CollectionResponse
                {
                    Data = new List<CollectionResponse.Collection>
                    {
                        new CollectionResponse.Collection
                        {
                            CollectionId = collection.CollectionId,
                            CollectionName = collection.CollectionName,
                            IsDefault = collection.IsDefault
                        }
                    }
                };
            });
        }
        
        public async Task<ApiResponse<CollectionResponse>> UpdateCollectionAsync(string collectionId, UpdateCollectionRequest request)
        {
            return await ValidateAndProcessAsync(request, _updateCollectionValidator, async req =>
            {
                var userId = GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedAccessException("User ID not found in token");
                }
                
                var client = await _supabaseService.GetClientWithUserToken();
                
                // Update collection
                var result = await client.From<CollectionDto>()
                    .Where(c => c.CollectionId == collectionId && c.UserId == userId)
                    .Set(c => c.CollectionName, req.CollectionName)
                    .Update();
                
                if (!result.ResponseMessage.IsSuccessStatusCode)
                {
                    throw new Exception($"Error updating collection: {result.ResponseMessage.ReasonPhrase}");
                }
                
                var collection = result.Models.FirstOrDefault();
                if (collection == null)
                {
                    throw new Exception("Collection not found or you do not have permission to update it");
                }
                
                return new CollectionResponse
                {
                    Data = new List<CollectionResponse.Collection>
                    {
                        new CollectionResponse.Collection
                        {
                            CollectionId = collection.CollectionId,
                            CollectionName = collection.CollectionName,
                            IsDefault = collection.IsDefault
                        }
                    }
                };
            });
        }
        
        public async Task<ApiResponse<object>> DeleteCollectionAsync(string collectionId)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("User ID not found in token");
            }
            
            var client = await _supabaseService.GetClientWithUserToken();
            
            // Check if collection is default
            var checkResult = await client.From<CollectionDto>()
                .Where(c => c.CollectionId == collectionId && c.UserId == userId)
                .Get();

            if (!checkResult.ResponseMessage.IsSuccessStatusCode)
            {
                throw new Exception($"Error checking collection: {checkResult.ResponseMessage.ReasonPhrase}");
            }

            var collection = checkResult.Models.FirstOrDefault();
            if (collection == null)
            {
                throw new Exception("Collection not found");
            }

            if (collection.IsDefault)
            {
                throw new Exception("Cannot delete default collection");
            }
            
            // Delete collection
            await client.From<CollectionDto>()
                .Where(c => c.CollectionId == collectionId && c.UserId == userId)
                .Delete();

            // Since we can't check the response directly, we can verify deletion by trying to get the collection again
            var verifyResult = await client.From<CollectionDto>()
                .Where(c => c.CollectionId == collectionId && c.UserId == userId)
                .Get();

            if (verifyResult.Models.Any())
            {
                throw new Exception("Failed to delete collection");
            }

            return new ApiResponse<object>
            {
                Success = true,
                Data = new { Message = "Collection deleted successfully" }
            };
        }
    }
}
