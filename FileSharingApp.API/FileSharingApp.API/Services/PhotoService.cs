using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using FileSharingApp.API.CustomExceptions;
using FileSharingApp.API.Helpers;
using FileSharingApp.API.Services.Interfaces;
using Microsoft.Extensions.Options;
using System.Net;

namespace FileSharingApp.API.Services
{
    public class PhotoService : IPhotoService
    {
        protected readonly IOptions<CloudinaryConfigOptions> config;

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

        public PhotoService(IOptions<CloudinaryConfigOptions> config)
        {
            this.config = config;
        }

        public ImageUploadResult UploadImage(IFormFile image, int userId)
        {
            var stream = image.OpenReadStream();

            //var path = CreateUserFolder(userId);

            var imageUploadParams = new ImageUploadParams()
            {
                File = new FileDescription(image.FileName, stream),
                UseFilename = true,
                UniqueFilename = false,
                Overwrite = true,
                Folder = userId.ToString()
            };

            var response = Cloudinary.Upload(imageUploadParams);
            return response;
        }

        //public string CreateUserFolder(int userId)
        //{
        //    if (UserFolderAlreadyExists(userId))
        //    {
        //        return string.Empty;
        //    }

        //    var result = Cloudinary.CreateFolder(userId.ToString());

        //    if(!result.Success)
        //    {
        //        throw new ImageUploadException("Error when creating folder within Cloudinary");
        //    }

        //    return result.Path;
        //}

        //private bool UserFolderAlreadyExists(int userId)
        //{
        //    return Cloudinary.GetResource(userId) != null;
        //}
    }
}
