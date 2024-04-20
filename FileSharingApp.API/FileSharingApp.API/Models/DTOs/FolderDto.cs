using FileSharingApp.API.Models.Files;
using System.ComponentModel.DataAnnotations;

namespace FileSharingApp.API.Models.DTOs
{
    public class FolderDto
    {
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public Folder? ParentFolder { get; set; }
    }
}
