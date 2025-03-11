using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Files;

namespace FileSharingApp.API.DAL.Interfaces
{
    public interface IFileRepository
    {
        void AddFile(AppFile file, int userId);

        PaginatedResponse<AppFile> GetFiles(FileSearchParams searchParams, int userId);

        IEnumerable<FileType> GetFileTypes(int userId);

        void DeleteFile(AppFile fileToDelete);

        void Update(AppFile file);

        AppFile Get(int id);

        FileType GetFileType(string fileTypeName);

        bool FileAlreadyExists(AppFile file, int userId);

        bool FileAlreadyExists(FileDto file, int userId);

        IEnumerable<AppFile> GetFolderFiles(int folderId);
    }
}
