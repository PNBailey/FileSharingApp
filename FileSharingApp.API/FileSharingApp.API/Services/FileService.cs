using CloudinaryDotNet;
using FileSharingApp.API.CustomExceptions;
using FileSharingApp.API.DAL.Interfaces;
using FileSharingApp.API.Helpers;
using FileSharingApp.API.Models.Files;
using FileSharingApp.API.Services.Interfaces;
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
                file.Url = response.Url.AbsoluteUri;
            }
            file.Name = Path.GetFileNameWithoutExtension(file.FileData.FileName);
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
                case ".jpeg":
                    return "Image";
                default:
                    throw new ArgumentException("File type is invalid");
            }
        }

        public IEnumerable<BaseFile> GetAllFiles(int userId)
        {
            return fileRepository.GetAllFiles(userId);
        }
    }
}
