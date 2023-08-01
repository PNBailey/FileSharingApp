using CloudinaryDotNet;
using FileSharingApp.API.DAL.Interfaces;
using FileSharingApp.API.Data;
using FileSharingApp.API.Helpers;
using FileSharingApp.API.Services;
using FileSharingApp.API.Services.Interfaces;
using FileSharingAppUnitTests.Helpers;
using Microsoft.Extensions.Options;
using System.Net;

namespace FileSharingAppUnitTests.TestClasses
{
    public class FileServiceTestClass : FileService
    {
        public new MockedCloudinary Cloudinary
        {
            get
            {
                return (MockedCloudinary)SetupCloudinary(config);
            }
        }

        protected override Cloudinary SetupCloudinary(IOptions<CloudinaryConfigOptions> config)
        {
            return new MockedCloudinary();
        }

        public FileServiceTestClass(IOptions<CloudinaryConfigOptions> config, IFileRepository fileRepository, IUserService userService) : base(config, fileRepository, userService)
        {
        }
    }
}
