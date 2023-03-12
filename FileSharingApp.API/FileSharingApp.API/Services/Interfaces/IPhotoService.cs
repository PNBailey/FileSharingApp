using CloudinaryDotNet.Actions;

namespace FileSharingApp.API.Services.Interfaces
{
    public interface IPhotoService
    {
        ImageUploadResult UploadImage(IFormFile image, int userId);

    }
}
