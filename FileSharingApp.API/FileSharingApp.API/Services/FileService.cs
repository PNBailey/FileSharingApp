using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using FileSharingApp.API.DAL.Interfaces;
using FileSharingApp.API.Helpers;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Files;
using FileSharingApp.API.Services.Interfaces;
using Microsoft.Extensions.Options;
using System.Text.Json;

namespace FileSharingApp.API.Services
{
    public class FileService : IFileService
    {
        protected readonly IOptions<CloudinaryConfigOptions> config;
        private readonly IFileRepository fileRepository;

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
            IFileRepository fileRepository)
        {
            this.config = config;
            this.fileRepository = fileRepository;
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
                    throw new ArgumentException("File type is invalid");
            }
        }

        public IEnumerable<BaseFile> GetFiles(FileSearchParams searchParams, int userId)
        {
            return fileRepository.GetFiles(searchParams, userId);
        }

        public IEnumerable<FileType> GetFileTypes(int userId)
        {
            return fileRepository.GetFileTypes(userId);
        }

        public void DeleteFile(string fileName)
        {
            fileRepository.DeleteFile(fileName);
        }

        public string BuildDownloadUrl(string publicId)
        {
            //var url = Cloudinary.Api.UrlImgUp
            //        .Secure(true)
            //        .Transform(new Transformation().Flags("attachment"))
            //        .BuildUrl(publicId);

            return "TO DO";
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
            appFile.FileTypeName = GetFileTypeName(Path.GetExtension(fileUploadDto.OriginalFile.FileName));
            appFile.Url = "TO DO";
            appFile.DownloadUrl = BuildDownloadUrl(appFile.Url);

            return appFile;
        }
    }
}
