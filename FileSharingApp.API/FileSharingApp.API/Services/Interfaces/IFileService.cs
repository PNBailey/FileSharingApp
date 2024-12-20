using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Files;

namespace FileSharingApp.API.Services.Interfaces
{
    public interface IFileService
    {
        BaseFile UploadFile(BaseFile appFile, int userId);

        string GetFileTypeName(string fileExtension);

        IEnumerable<BaseFile> GetFiles(FileSearchParams searchParams, int userId);

        IEnumerable<FileType> GetFileTypes(int userId);

        void DeleteFile(string url);

        string BuildDownloadUrl(string url);

        void Update(BaseFile file);

        BaseFile Get(int id);

        BaseFile CreateAppFile(FileUploadDto fileUploadDto);
    }
}
