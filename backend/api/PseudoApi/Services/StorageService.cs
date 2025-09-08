using Supabase;

namespace PseudoApi.Services
{
    public class StorageService
    {
        private readonly SupabaseService _supabaseService;

        public StorageService(SupabaseService supabaseService)
        {
            _supabaseService = supabaseService;
        }

        public async Task<string> UploadFileAsync(string bucketName, string filePath, Stream fileStream)
        {
            var client = await _supabaseService.GetClientWithUserToken();
            var bucket = client.Storage.From(bucketName);
            
            var response = await bucket.Upload(fileStream, filePath);
            
            if (response.Error != null)
            {
                throw new Exception($"File upload failed: {response.Error.Message}");
            }
            
            return response.Data.Path;
        }

        public async Task<Stream> DownloadFileAsync(string bucketName, string filePath)
        {
            var client = await _supabaseService.GetClientWithUserToken();
            var bucket = client.Storage.From(bucketName);
            
            var response = await bucket.Download(filePath);
            
            if (response.Error != null)
            {
                throw new Exception($"File download failed: {response.Error.Message}");
            }
            
            return response.Data;
        }

        public async Task DeleteFileAsync(string bucketName, string filePath)
        {
            var client = await _supabaseService.GetClientWithUserToken();
            var bucket = client.Storage.From(bucketName);
            
            var response = await bucket.Remove(new[] { filePath });
            
            if (response.Error != null)
            {
                throw new Exception($"File deletion failed: {response.Error.Message}");
            }
        }
    }
}
