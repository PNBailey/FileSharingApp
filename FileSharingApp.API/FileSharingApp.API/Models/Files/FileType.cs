using System.ComponentModel.DataAnnotations.Schema;

namespace FileSharingApp.API.Models.Files
{
    public class FileType
    {
        public int Id { get; set; }

        [Column(TypeName = "varchar(1000)")]
        public string Name { get; set; } = null!;

        [Column(TypeName = "varchar(1000)")]
        public string Icon { get; set; } = null!;
    }
}
