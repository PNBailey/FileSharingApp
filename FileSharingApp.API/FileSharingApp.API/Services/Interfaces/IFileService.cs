using FileSharingApp.API.Models.Files;

namespace FileSharingApp.API.Services.Interfaces
{
    public interface IFileService
    {
        Task<BaseFile> UploadFile(BaseFile file, int userId);

        object CreateFileType(string contentType);

        string GetFileTypeName(string fileExtension);

        IEnumerable<BaseFile> GetAllFiles(int userId);

        IEnumerable<BaseFile> GetFolderFiles(int folderId, int userId);

        void DeleteFile(string url);
    }
}
