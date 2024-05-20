using FileSharingApp.API.Models.Files;

namespace FileSharingApp.API.DAL.Interfaces
{
    public interface IFileRepository
    {
        void UploadFile(BaseFile file);

        IEnumerable<BaseFile> GetAllFiles(int userId);

        IEnumerable<BaseFile> GetFolderFiles(int folderId, int userId);

        void DeleteFile(string url);
    }
}
