using FileSharingApp.API.Models.Files;
using Microsoft.AspNetCore.Mvc;
using NPOI.Util;

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

        string BuildDownloadUrl(string url);

        void Update(BaseFile file);

        BaseFile Get(int id);
    }
}
