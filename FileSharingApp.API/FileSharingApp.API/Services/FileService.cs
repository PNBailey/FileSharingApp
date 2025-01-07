using FileSharingApp.API.DAL.Interfaces;
using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Files;
using FileSharingApp.API.Services.Interfaces;
using Google.Cloud.Storage.V1;
using System.IO;
using System.Text.Json;

namespace FileSharingApp.API.Services
{
    public class FileService : IFileService
    {
        private readonly IFileRepository fileRepository;
        private readonly StorageClient storageClient;
        private readonly string bucketName;

        public FileService( 
            IFileRepository fileRepository,
            IConfiguration config)
        {
            this.fileRepository = fileRepository;
            storageClient = StorageClient.Create();
            bucketName = config["CloudStorageConfig:BucketName"];
        }

        public BaseFile UploadFile(BaseFile appFile, int userId)
        {
            fileRepository.UploadFile(appFile, userId);
            return appFile;
        }

        public string GetFileTypeName(string fileExtension)
        {
            switch(fileExtension.ToLower())
            {
                case ".doc":
                case ".docx":
                case ".docm":
                    return "Word";
                case ".xlsx":
                case ".xlsm":
                    return "Excel";
                case ".pptx":
                case ".pptm":
                case ".ppt":
                    return "PowerPoint";
                case ".pdf":
                    return "Pdf";
                case ".png":
                case ".jpg":
                    return "Image";
                default:
                    throw new ArgumentException("File type not supported");
            }
        }

        public PaginatedResponse<BaseFile> GetFiles(FileSearchParams searchParams, int userId)
        {
            return fileRepository.GetFiles(searchParams, userId);
        }

        public IEnumerable<FileType> GetFileTypes(int userId)
        {
            return fileRepository.GetFileTypes(userId);
        }

        public void DeleteFile(string fileName)
        {
            DeleteFileFromCloudStorage(fileName);
            fileRepository.DeleteFile(fileName);
        }

        public void Update(BaseFile file)
        {
            fileRepository.Update(file);
        }

        public BaseFile Get(int id)
        {
            return fileRepository.Get(id);
        }

        public BaseFile CreateAppFile(FileUploadDto fileUploadDto)
        {
            BaseFile appFile = JsonSerializer.Deserialize<BaseFile>(fileUploadDto.FileData)!;
            appFile.Name = Path.GetFileNameWithoutExtension(appFile.Name);
            appFile.FileType = fileRepository.GetFileType(GetFileTypeName(Path.GetExtension(fileUploadDto.OriginalFile.FileName)));

            return appFile;
        }

        public string AddFileToCloudStorage(FileUploadDto fileUploadDto, string fileName)
        {
            using (var fileStream = fileUploadDto.OriginalFile.OpenReadStream())
            {
                var storageObject = storageClient.UploadObject(
                    bucket: bucketName,
                    objectName: fileName,
                    contentType: fileUploadDto.OriginalFile.ContentType,
                    source: fileStream
                );
                return storageObject.MediaLink;
            }
        }

        public void DeleteFileFromCloudStorage(string fileName)
        {
            storageClient.DeleteObject(bucketName, fileName);
        }

        public Google.Apis.Storage.v1.Data.Object DownloadObjectFromCloudStorage(string fileName, MemoryStream memoryStream)
        {
            return storageClient.DownloadObject(bucketName, fileName, memoryStream);
        }
    }
}
