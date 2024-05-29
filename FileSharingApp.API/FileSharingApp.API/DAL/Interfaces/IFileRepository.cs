using FileSharingApp.API.Models.Files;

namespace FileSharingApp.API.DAL.Interfaces
{
    public interface IFileRepository
    {
        void UploadFile(BaseFile file);

        IEnumerable<BaseFile> GetFiles(FileSearchParams searchParams, int userId);

        void DeleteFile(string url);

        void Update(BaseFile file);

        BaseFile Get(int id);
    }
}
