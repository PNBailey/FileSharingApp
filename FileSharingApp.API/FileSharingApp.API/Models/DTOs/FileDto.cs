namespace FileSharingApp.API.Models.DTOs
{
    public class FileDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string FileTypeName { get; set; } = null!;

        public string Url { get; set; } = null!;

        public string DownloadUrl { get; set; } = null!;
    }
}
