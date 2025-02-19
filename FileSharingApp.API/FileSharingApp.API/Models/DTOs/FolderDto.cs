using FileSharingApp.API.Models.Files;
using System.ComponentModel.DataAnnotations;

namespace FileSharingApp.API.Models.DTOs
{
    public class FolderDto
    {
        public string Name { get; set; } = string.Empty;

        public int Id { get; set; }

        public string? Description { get; set; }

        public int? ParentFolderId { get; set; }
    }
}
