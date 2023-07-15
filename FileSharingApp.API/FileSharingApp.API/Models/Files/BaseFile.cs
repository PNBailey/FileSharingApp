using CloudinaryDotNet.Actions;
using System.ComponentModel.DataAnnotations.Schema;

namespace FileSharingApp.API.Models.Files
{
    public abstract class BaseFile
    {
        public int Id { get; set; }

        [NotMapped]
        public IFormFile FileData { get; set; } = null!;

        public string Url { get; set; } = null!;

        public abstract RawUploadParams GetUploadParams(int userId);
    }
}
