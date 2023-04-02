using CloudinaryDotNet;
using FileSharingApp.API.Helpers;
using FileSharingApp.API.Services;
using FileSharingAppUnitTests.Helpers;
using Microsoft.Extensions.Options;
using System.Net;

namespace FileSharingAppUnitTests.TestClasses
{
    public class PhotoServiceTestClass : PhotoService
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

        public PhotoServiceTestClass(IOptions<CloudinaryConfigOptions> config) : base(config)
        {
        }
    }
}
