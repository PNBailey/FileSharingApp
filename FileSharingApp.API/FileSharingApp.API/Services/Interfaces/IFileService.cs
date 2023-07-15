using CloudinaryDotNet.Actions;
using FileSharingApp.API.Models.Files;

namespace FileSharingApp.API.Services.Interfaces
{
    public interface IFileService
    {
        Task<RawUploadResult> UploadFile(BaseFile file, int userId);

        object CreateFileType(string contentType);
    }
}
