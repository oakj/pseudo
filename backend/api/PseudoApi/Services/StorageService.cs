using System.Net.Http;
using System.Net.Http.Headers;

namespace PseudoApi.Services
{
    /*
     * StorageService acts on blob buckets from Supabase
     * This class uses direct http calls via IHttpClientFactory instead of the office Supabase client
     * Supabase client does not work well (RLS security and auth issues) when interacting with Supabase Storage
     */
    public class StorageService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public StorageService(
            IHttpClientFactory httpClientFactory,
            IHttpContextAccessor httpContextAccessor)
        {
            _httpClientFactory = httpClientFactory;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<string> UploadFileAsync(string bucketName, string filePath, Stream fileStream)
        {
            try
            {
                var client = _httpClientFactory.CreateClient("supabase");
                
                // Get the JWT token from the current request
                var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"]
                    .FirstOrDefault()?.Split(" ").Last();
                
                if (!string.IsNullOrEmpty(token))
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                }
                
                // Create multipart form content for the file
                using var content = new MultipartFormDataContent();
                using var streamContent = new StreamContent(fileStream);
                content.Add(streamContent, "file", Path.GetFileName(filePath));
                
                // Make direct HTTP request to upload the file
                var response = await client.PostAsync($"/storage/v1/object/{bucketName}/{filePath}", content);
                
                if (response.IsSuccessStatusCode)
                {
                    return filePath;
                }
                
                throw new Exception($"Failed to upload file: {response.StatusCode}");
            }
            catch (Exception ex)
            {
                throw new Exception($"File upload failed: {ex.Message}");
            }
        }

        public async Task<Stream> DownloadFileAsync(string bucketName, string filePath)
        {
            try
            {
                var client = _httpClientFactory.CreateClient("supabase");
                
                // Get the JWT token from the current request
                var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"]
                    .FirstOrDefault()?.Split(" ").Last();
                
                if (!string.IsNullOrEmpty(token))
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                }
                
                // Make direct HTTP request to download the file
                var response = await client.GetAsync($"/storage/v1/object/{bucketName}/{filePath}");
                
                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStreamAsync();
                }
                
                // If the file doesn't exist or we don't have permission, create an empty one
                if (response.StatusCode == System.Net.HttpStatusCode.NotFound || 
                    response.StatusCode == System.Net.HttpStatusCode.Forbidden)
                {
                    // Return an empty stream or throw a specific exception
                    // that can be caught and handled by the calling code
                    throw new FileNotFoundException($"File not found: {filePath}", filePath);
                }
                
                throw new Exception($"Failed to download file: {response.StatusCode}");
            }
            catch (FileNotFoundException)
            {
                // Re-throw file not found exceptions to be handled by the caller
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception($"File download failed: {ex.Message}");
            }
        }

        public async Task DeleteFileAsync(string bucketName, string filePath)
        {
            try
            {
                var client = _httpClientFactory.CreateClient("supabase");
                
                // Get the JWT token from the current request
                var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"]
                    .FirstOrDefault()?.Split(" ").Last();
                
                if (!string.IsNullOrEmpty(token))
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                }
                
                // Make direct HTTP request to delete the file
                var response = await client.DeleteAsync($"/storage/v1/object/{bucketName}/{filePath}");
                
                if (!response.IsSuccessStatusCode && response.StatusCode != System.Net.HttpStatusCode.NotFound)
                {
                    throw new Exception($"Failed to delete file: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"File deletion failed: {ex.Message}");
            }
        }
        
        public async Task<IEnumerable<string>> ListFilesAsync(string bucketName, string path = "")
        {
            try
            {
                var client = _httpClientFactory.CreateClient("supabase");
                
                // Get the JWT token from the current request
                var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"]
                    .FirstOrDefault()?.Split(" ").Last();
                
                if (!string.IsNullOrEmpty(token))
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                }
                
                // Make direct HTTP request to list files
                var response = await client.GetAsync($"/storage/v1/object/list/{bucketName}/{path}");
                
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    // Parse the JSON response to extract file names
                    var files = System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, object>>>(content);
                    return files.Select(f => f["name"].ToString());
                }
                
                return Enumerable.Empty<string>();
            }
            catch (Exception ex)
            {
                throw new Exception($"File listing failed: {ex.Message}");
            }
        }
    }
}
