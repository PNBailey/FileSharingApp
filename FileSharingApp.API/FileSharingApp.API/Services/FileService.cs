using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
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

        public async Task<RawUploadResult> UploadFile(BaseFile file, int userId)
        {
            var uploadParams = file.GetUploadParams(userId);
            var response = await Cloudinary.UploadAsync(uploadParams);
            if (response.Error == null)
            {
                file.Url = response.Url.AbsoluteUri;
                var convertedFile = FileIsAnXmlFile(file) ? ConvertToXmlFileAndAddThumbnailUrl(file, response) : file;
                this.context.Files.Add(convertedFile);
                this.context.SaveChanges();
            }
            return response;
        }

        private static XmlFile ConvertToXmlFileAndAddThumbnailUrl(BaseFile file, RawUploadResult response)
        {
            var xmlFile = (XmlFile)file;
            xmlFile.ThumbnailUrl = $"{response.Url.AbsoluteUri}.pdf";
            return xmlFile;
        }

        private static bool FileIsAnXmlFile(BaseFile file)
        {
            return file.GetType() == typeof(XmlFile);
        }

        public object CreateFileType(string contentType)
        {
            var fileTypeName = GetFileTypeName(contentType);
            Type fileType = Type.GetType($"FileSharingApp.API.Models.Files.{fileTypeName}File")!;
            var newFile = Activator.CreateInstance(fileType);
            if(newFile == null) throw new ArgumentException("File type is invalid");
            return newFile;

        }

        private static string GetFileTypeName(string contentType)
        {
            switch(contentType)
            {
                case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                    return "Xml";
                case "application/pdf":
                    return "Pdf";
                case "image/png":
                case "image/jpeg":
                    return "Image";
                default:
                    throw new ArgumentException("File type is invalid");
            }
        }
    }
}
