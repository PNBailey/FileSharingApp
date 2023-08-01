using FileSharingApp.API.Helpers;
using Microsoft.Extensions.Options;
using Moq;

namespace FileSharingAppUnitTests.Helpers
{
    public static class MockCloudinaryConfigGenerator
    {
        public static Mock<IOptions<CloudinaryConfigOptions>> CreateMockCloudinaryConfig()
        {
            var mockCloudinaryConfig = new Mock<IOptions<CloudinaryConfigOptions>>();
            mockCloudinaryConfig.Setup(x => x.Value).Returns(new CloudinaryConfigOptions { CloudName = "test_cloud", ApiKey = "test_api_key", ApiSecret = "test_api_secret" });
            return mockCloudinaryConfig;
        }
    }
}
