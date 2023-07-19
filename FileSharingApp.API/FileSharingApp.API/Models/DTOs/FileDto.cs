namespace FileSharingApp.API.Models.DTOs
{
    public class FileDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string FileTypeName { get; set; } = string.Empty;

        public string Url { get; set; } = null!;
    }
}
