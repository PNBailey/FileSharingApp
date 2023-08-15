using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace FileSharingApp.API.Models.Files
{
    public class ImageFile : BaseFile
    {
        public override RawUploadParams GetUploadParams(int userId)
        {
            var stream = this.FileData.OpenReadStream();

            var imageUploadParams = new ImageUploadParams()
            {
                File = new FileDescription(this.FileData.FileName, stream),
                UseFilename = true,
                UniqueFilename = false,
                Overwrite = true,
                Folder = userId.ToString(),
                Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
            };

            return imageUploadParams;
        }
    }
}
