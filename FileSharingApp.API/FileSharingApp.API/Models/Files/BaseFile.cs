using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FileSharingApp.API.Models.Files
{
    public class BaseFile
    {
        public int Id { get; set; }

        public AppUser FileOwner { get; set; } = null!;

        [Column(TypeName = "varchar(1000)")]
        [JsonPropertyName("name")]
        public string Name { get; set; } = null!;

        [Column(TypeName = "varchar(1000)")]
        public string DownloadUrl { get; set; } = null!;

        public FileType FileType { get; set; } = null!;

        public int FileTypeId { get; set; }

        public Folder? Folder { get; set; }

        [JsonPropertyName("folderId")]
        public int? FolderId { get; set; }

        [Column(TypeName = "varchar(1000)")]
        public string? Description { get; set; }

        [JsonPropertyName("lastModified")]
        public DateTime LastModified { get; set; }

        [JsonPropertyName("size")]
        public int Size { get; set; }
    }
}
