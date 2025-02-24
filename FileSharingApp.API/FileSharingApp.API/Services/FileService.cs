using FileSharingApp.API.DAL.Interfaces;
using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Files;
using FileSharingApp.API.Services.Interfaces;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage.V1;
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

        public BaseFile SaveFile(BaseFile appFile, int userId)
        {
            fileRepository.SaveFile(appFile, userId);
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

        public Google.Apis.Storage.v1.Data.Object AddFileToCloudStorage(IFormFile file)
        {
            using (var fileStream = file.OpenReadStream())
            {
                var storageObject = storageClient.UploadObject(
                    bucket: bucketName,
                    objectName: Path.GetFileNameWithoutExtension(file.FileName),
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

        public void MakeFilePublic(Google.Apis.Storage.v1.Data.Object storageObject)
        {
            storageClient.UpdateObject(storageObject, new UpdateObjectOptions { PredefinedAcl = PredefinedObjectAcl.PublicRead });
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
