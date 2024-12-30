using FileSharingApp.API.Models.Files;

namespace FileSharingApp.API.DAL.Interfaces
{
    public interface IFileRepository
    {
        void UploadFile(BaseFile file, int userId);

        IEnumerable<BaseFile> GetFiles(FileSearchParams searchParams, int userId);

        IEnumerable<FileType> GetFileTypes(int userId);

        void DeleteFile(string fileName);

        void Update(BaseFile file);

        BaseFile Get(int id);
    }
}
