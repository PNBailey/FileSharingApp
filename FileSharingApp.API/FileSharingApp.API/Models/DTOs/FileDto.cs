using FileSharingApp.API.Models.Files;

namespace FileSharingApp.API.Models.DTOs
{
    public class FileDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public FileType FileType { get; set; } = null!;

        public string DownloadUrl { get; set; } = null!;

        public int? FolderId { get; set; }

        public string? Description { get; set; }

        public DateTime LastModified { get; set; }

        public int Size { get; set; }

    }
}
