using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Files;

namespace FileSharingApp.API.Services.Interfaces
{
    public interface IFileService
    {
        AppFile AddFile(AppFile appFile, int userId);

        string GetFileTypeName(string fileExtension);

        PaginatedResponse<AppFile> GetFiles(FileSearchParams searchParams, int userId);

        IEnumerable<FileType> GetFileTypes(int userId);

        void DeleteFile(AppFile fileToDelete);

        void Update(AppFile file);

        AppFile Get(int id);

        AppFile CreateAppFile(FileUploadDto fileUploadDto);

        Google.Apis.Storage.v1.Data.Object AddFileToCloudStorage(IFormFile file, int userId, int? folderId = 0);

        void UpdateFileOnCloudStorage(string existingFileName, string newFileName);

        (Stream FileStream, string ContentType, string FileName) DownloadObjectFromCloudStorage(string fileName, int userId);

        void DeleteFileFromCloudStorage(string fileName);

        string GetSignedUrl(string objectName);

        bool FileAlreadyExists(FileDto file, int userId);

        bool FileAlreadyExists(AppFile file, int userId);

        bool HasFileNameOrFolderChanged(AppFile existingFile, FileDto updatedFile);

        void DeleteAllFolderFiles(int folderId);
    }
}
