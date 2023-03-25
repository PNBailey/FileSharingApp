using CloudinaryDotNet.Actions;
using FileSharingApp.API.Helpers;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

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
