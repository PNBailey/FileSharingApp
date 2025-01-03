using FileSharingApp.API.Models;
using FileSharingApp.API.Models.Files;

namespace FileSharingApp.API.DAL.Interfaces
{
    public interface IFileRepository
    {
        void UploadFile(BaseFile file, int userId);

        PaginatedResponse<BaseFile> GetFiles(FileSearchParams searchParams, int userId);

        IEnumerable<FileType> GetFileTypes(int userId);

        void DeleteFile(string fileName);

        void Update(BaseFile file);

        BaseFile Get(int id);

        FileType GetFileType(string fileTypeName);
    }
}
