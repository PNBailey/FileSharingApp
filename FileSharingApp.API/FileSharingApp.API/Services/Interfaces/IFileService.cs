using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Files;

namespace FileSharingApp.API.Services.Interfaces
{
    public interface IFileService
    {
        BaseFile UploadFile(BaseFile appFile, int userId);

        string GetFileTypeName(string fileExtension);

        PaginatedResponse<BaseFile> GetFiles(FileSearchParams searchParams, int userId);

        IEnumerable<FileType> GetFileTypes(int userId);

        void DeleteFile(string fileName);

        void Update(BaseFile file);

        BaseFile Get(int id);

        BaseFile CreateAppFile(FileUploadDto fileUploadDto);

        string AddFileToCloudStorage(FileUploadDto fileUploadDto, string fileName);

        Google.Apis.Storage.v1.Data.Object DownloadObjectFromCloudStorage(string fileName, MemoryStream memoryStream);

        void DeleteFileFromCloudStorage(string fileName);
    }
}
