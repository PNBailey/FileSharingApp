using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using FileSharingApp.API.CustomExceptions;
using FileSharingApp.API.Data;
using FileSharingApp.API.Helpers;
using FileSharingApp.API.Models.Files;
using FileSharingApp.API.Services.Interfaces;
using Microsoft.Extensions.Options;

namespace FileSharingApp.API.Services
{
    public class FileService : IFileService
    {
        protected readonly IOptions<CloudinaryConfigOptions> config;
        private readonly DataContext context;

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
            DataContext context
        )
        {
            this.config = config;
            this.context = context;
        }

        public async Task<BaseFile> UploadFile(BaseFile file, int userId)
        {
            var uploadParams = file.GetUploadParams(userId);
            var response = await Cloudinary.UploadAsync(uploadParams);
            if (response.Error != null)
            {
                throw new FileUploadException(response.Error.Message);
            }

            file.Url = response.Url.AbsoluteUri;
            this.context.Files.Add(file);
            this.context.SaveChanges();

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
    }
}
