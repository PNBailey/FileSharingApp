using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using FileSharingApp.API.CustomExceptions;
using FileSharingApp.API.DAL.Interfaces;
using FileSharingApp.API.Helpers;
using FileSharingApp.API.Models.Files;
using FileSharingApp.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace FileSharingApp.API.Services
{
    public class FileService : IFileService
    {
        protected readonly IOptions<CloudinaryConfigOptions> config;
        private readonly IFileRepository fileRepository;
        private readonly IUserService userService;

        protected Cloudinary Cloudinary
        {
            get
            {
                return SetupCloudinary(config);
            }
        }

        protected virtual Cloudinary SetupCloudinary(IOptions<CloudinaryConfigOptions> config)
        {
            Account account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret);

            Cloudinary cloudinary = new Cloudinary(account);
            cloudinary.Api.Secure = true;
            return cloudinary;
        }

        public FileService(
            IOptions<CloudinaryConfigOptions> config, 
            IFileRepository fileRepository,
            IUserService userService)
        {
            this.userService = userService;
            this.config = config;
            this.fileRepository = fileRepository;
        }

        public async Task<BaseFile> UploadFile(BaseFile file, int userId)
        {
            var uploadParams = file.GetUploadParams(userId);
            var response = await Cloudinary.UploadAsync(uploadParams);
            if (response.Error != null)
            {
                throw new FileUploadException(response.Error.Message);
            }
            file.FileOwner = await this.userService.FindByIdAsync(userId);
            if (response.Url != null)
            {
                file.Url = response.PublicId;
            }
            file.Name = Path.GetFileNameWithoutExtension(file.FileData.FileName);
            file.DownloadUrl = BuildDownloadUrl(file.Url);
            fileRepository.UploadFile(file);

            return file;
        }

        public object CreateFileType(string fileTypeName)
        {
            Type fileType = Type.GetType($"FileSharingApp.API.Models.Files.{fileTypeName}File")!;
            var newFile = Activator.CreateInstance(fileType);
            if(newFile == null) throw new ArgumentException("File type is invalid");
            return newFile;

        }

        public string GetFileTypeName(string fileExtension)
        {
            switch(fileExtension)
            {
                case ".doc":
                case ".docx":
                case ".docm":
                case ".xlsx":
                case ".xlsm":
                case ".pptx":
                case ".pptm":
                case ".ppt":
                    return "Xml";
                case ".pdf":
                    return "Pdf";
                case ".png":
                case ".jpg":
                    return "Image";
                default:
                    throw new ArgumentException("File type is invalid");
            }
        }

        public IEnumerable<BaseFile> GetAllFiles(int userId)
        {
            return fileRepository.GetAllFiles(userId);
        }

        public IEnumerable<BaseFile> GetFolderFiles(int folderId, int userId)
        {
            return fileRepository.GetFolderFiles(folderId, userId);
        }

        public void DeleteFile(string url)
        {
            DeletionResult imageDeletionResult = DeleteImage(url);
            DeletionResult rawDeletionResult = DeleteRaw(url);

            if (imageDeletionResult.Result == "ok" || rawDeletionResult.Result == "ok")
            {
                fileRepository.DeleteFile(url);
            } 
            else
            {
                throw new InvalidOperationException();
            }
        }

        private DeletionResult DeleteImage(string url)
        {
            DeletionParams deletionParams = new DeletionParams(url);
            deletionParams.ResourceType = ResourceType.Image;
            return Cloudinary.Destroy(deletionParams);
        }

        private DeletionResult DeleteRaw(string url)
        {
            DeletionParams deletionParams = new DeletionParams(url);
            deletionParams.ResourceType = ResourceType.Raw;
            return Cloudinary.Destroy(deletionParams);
        }

        public string BuildDownloadUrl(string publicId)
        {
            var url = Cloudinary.Api.UrlImgUp
                    .Secure(true)
                    .Transform(new Transformation().Flags("attachment"))
                    .BuildUrl(publicId);

            return url;
        }

        public void Update(BaseFile file)
        {
            fileRepository.Update(file);
        }

        public BaseFile Get(int id)
        {
            return fileRepository.Get(id);
        }
    }
}
