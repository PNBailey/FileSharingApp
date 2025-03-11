using FileSharingApp.API.DAL.Interfaces;
using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Files;
using FileSharingApp.API.Services.Interfaces;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage.V1;
using System.Text;
using System.Text.Json;

namespace FileSharingApp.API.Services
{
    public class FileService : IFileService
    {
        private readonly IFileRepository fileRepository;
        private readonly IFolderService folderService;
        private readonly StorageClient storageClient;
        private readonly string bucketName;

        public FileService( 
            IFileRepository fileRepository,
            IConfiguration config,
            IFolderService folderService)
        {
            this.fileRepository = fileRepository;
            this.folderService = folderService;
            storageClient = StorageClient.Create();
            bucketName = config["CloudStorageConfig:BucketName"];
        }

        public AppFile AddFile(AppFile appFile, int userId)
        {
            fileRepository.AddFile(appFile, userId);
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

        public PaginatedResponse<AppFile> GetFiles(FileSearchParams searchParams, int userId)
        {
            if(searchParams.FolderId == null)
            {
                searchParams.FolderId = folderService.GetTopLevelFolder(userId).Id;
            }
            return fileRepository.GetFiles(searchParams, userId);
        }

        public IEnumerable<FileType> GetFileTypes(int userId)
        {
            return fileRepository.GetFileTypes(userId);
        }

        public void DeleteFile(int id)
        {
            var fileToDelete = Get(id);
            DeleteFileFromCloudStorage(fileToDelete.Name);
            fileRepository.DeleteFile(fileToDelete);
        }

        public void Update(AppFile file)
        {
            fileRepository.Update(file);
        }

        public AppFile Get(int id)
        {
            return fileRepository.Get(id);
        }

        public AppFile CreateAppFile(FileUploadDto fileUploadDto)
        {
            AppFile appFile = JsonSerializer.Deserialize<AppFile>(fileUploadDto.FileData)!;
            appFile.Name = Path.GetFileNameWithoutExtension(appFile.Name);
            appFile.FileType = fileRepository.GetFileType(GetFileTypeName(Path.GetExtension(fileUploadDto.OriginalFile.FileName)));

            return appFile;
        }

        public Google.Apis.Storage.v1.Data.Object AddFileToCloudStorage(IFormFile file, int userId)
        {
            using (var fileStream = file.OpenReadStream())
            {
                var storageObject = storageClient.UploadObject(
                    bucket: bucketName,
                    objectName: $"{userId}/{Path.GetFileNameWithoutExtension(file.FileName)}",
                    contentType: file.ContentType,
                    source: fileStream
                );
                return storageObject;
            }
        }

        public void DeleteFileFromCloudStorage(string fileName)
        {
            storageClient.DeleteObject(bucketName, fileName);
        }

        public void UpdateFileOnCloudStorage(string existingFileName, string newFileName)
        {
            storageClient.CopyObject(
                bucketName, existingFileName,
                bucketName, newFileName
            );

            DeleteFileFromCloudStorage(existingFileName);
        }

        public Google.Apis.Storage.v1.Data.Object DownloadObjectFromCloudStorage(string fileName, MemoryStream memoryStream)
        {
            return storageClient.DownloadObject(bucketName, fileName, memoryStream);
        }

        public string GetSignedUrl(string objectName)
        {
            UrlSigner signer = UrlSigner.FromCredential(GoogleCredential.GetApplicationDefault());
            string signedUrl = signer.Sign(
                bucketName,
                objectName,
                TimeSpan.FromDays(7),
                HttpMethod.Get
            );
            return signedUrl;
        }

        public bool FileAlreadyExists(FileDto file, int userId)
        {
            return fileRepository.FileAlreadyExists(file, userId);
        }

        public bool FileAlreadyExists(AppFile file, int userId)
        {
            return fileRepository.FileAlreadyExists(file, userId);
        }

        public bool HasFileNameOrFolderChanged(AppFile existingFile, FileDto updatedFile)
        {
            return existingFile.Name != updatedFile.Name || existingFile.FolderId != updatedFile.FolderId;
        }

        public void DeleteAllFolderFiles(int folderId)
        {
            var files = fileRepository.GetFolderFiles(folderId).ToList();

            foreach (var file in files)
            {
                DeleteFile(file.Id);
            }
        }
    }
}
