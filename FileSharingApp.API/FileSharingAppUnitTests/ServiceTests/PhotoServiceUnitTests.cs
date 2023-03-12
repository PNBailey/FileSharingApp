using CloudinaryDotNet.Actions;
using FileSharingApp.API.Services;
using FileSharingAppUnitTests.Helpers;
using FileSharingAppUnitTests.TestClasses;
using Microsoft.AspNetCore.Http;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace FileSharingAppUnitTests.ServiceTests
{
    public class PhotoServiceUnitTests
    {
        [Fact]
        public void SetupCloudinary_should_create_a_cloudinary_object()
        {
            var mockCloudinaryConfig = MockCloudinaryConfigGenerator.CreateMockCloudinaryConfig();
            var service = new PhotoServiceTestClass(mockCloudinaryConfig.Object);
            Assert.IsType<MockedCloudinary>(service.Cloudinary);
            Assert.Equal("test_cloud", service.Cloudinary.Api.Account.Cloud);
        }

        [Fact]
        public void UploadImage_returns_an_ImageUploadResult_containing_a_200_response_when_upload_Successful()
        {
            var mockCloudinaryConfig = MockCloudinaryConfigGenerator.CreateMockCloudinaryConfig();
            var service = new PhotoServiceTestClass(mockCloudinaryConfig.Object);
            var bytes = Encoding.UTF8.GetBytes("This is a dummy file");
            IFormFile mockImage = new FormFile(new MemoryStream(bytes), 0, bytes.Length, "", "TestImage");
            var result = service.UploadImage(mockImage, 1234);

            Assert.IsType<ImageUploadResult>(result);
            Assert.Equal(HttpStatusCode.OK, result.StatusCode);
        }
    }
}
