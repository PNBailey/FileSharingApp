using CloudinaryDotNet;
using FileSharingApp.API.Helpers;
using FileSharingAppUnitTests.Helpers;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace FileSharingAppUnitTests.HelperTests
{
    public class CloudinaryConfigSetupUnitTests
    {
        [Fact]
        public void SetupCloudinary_method_returns_a_cloudinary_class()
        {
            var mockCloudinaryConfig = MockCloudinaryConfigGenerator.CreateMockCloudinaryConfig();
            var result = CloudinaryConfigSetup.SetupCloudinary(mockCloudinaryConfig.Object);

            Assert.IsType<Cloudinary>(result);
        }
    }
}
