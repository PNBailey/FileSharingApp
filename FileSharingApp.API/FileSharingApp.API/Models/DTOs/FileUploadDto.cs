namespace FileSharingApp.API.Models.DTOs
{
    public class FileUploadDto
    {
        public IFormFile OriginalFile { get; set; } = null!;
        public string FileData { get; set; } = null!;
    }
}
