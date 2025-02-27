﻿using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Files;

namespace FileSharingApp.API.Services.Interfaces
{
    public interface IFileService
    {
        BaseFile SaveFile(BaseFile appFile, int userId);

        string GetFileTypeName(string fileExtension);

        PaginatedResponse<BaseFile> GetFiles(FileSearchParams searchParams, int userId);

        IEnumerable<FileType> GetFileTypes(int userId);

        void DeleteFile(int id);

        void Update(BaseFile file);

        BaseFile Get(int id);

        BaseFile CreateAppFile(FileUploadDto fileUploadDto);

        Google.Apis.Storage.v1.Data.Object AddFileToCloudStorage(IFormFile file);

        void UpdateFileOnCloudStorage(string existingFileName, string newFileName);

        Google.Apis.Storage.v1.Data.Object DownloadObjectFromCloudStorage(string fileName, MemoryStream memoryStream);

        void DeleteFileFromCloudStorage(string fileName);

        void MakeFilePublic(Google.Apis.Storage.v1.Data.Object storageObject);

        string GetSignedUrl(string objectName);

        bool FileAlreadyExists(FileDto file, int userId);

        void DeleteAllFolderFiles(int folderId);
    }
}
