using FileSharingApp.API.DAL.Interfaces;
using FileSharingApp.API.Models.Files;
using FileSharingAppUnitTests.Helpers;
using FileSharingAppUnitTests.Helpers.OtherGenerators;
using FileSharingAppUnitTests.TestClasses;
using Microsoft.AspNetCore.Http;
using Moq;
using System.Text;
using Xunit;

namespace FileSharingAppUnitTests.ServiceTests
{
    public class FileServiceUnitTests
    {
        [Fact]
        public void SetupCloudinary_should_create_a_cloudinary_object()
        {
            var mockCloudinaryConfig = MockCloudinaryConfigGenerator.CreateMockCloudinaryConfig();
            var mockUserService = MockUserServiceGenerator.GenerateMockUserService();
            var service = new FileServiceTestClass(mockCloudinaryConfig.Object, new Mock<IFileRepository>().Object, mockUserService.Object);
            Assert.IsType<MockedCloudinary>(service.Cloudinary);
            Assert.Equal("test_cloud", service.Cloudinary.Api.Account.Cloud);
        }

        [Fact]
        public void UploadFile_returns_the_uploaded_file_when_upload_Successful()
        {
            var mockCloudinaryConfig = MockCloudinaryConfigGenerator.CreateMockCloudinaryConfig();
            var mockUserService = MockUserServiceGenerator.GenerateMockUserService();
            var mockFileRepository = new Mock<IFileRepository>();
            var service = new FileServiceTestClass(mockCloudinaryConfig.Object, mockFileRepository.Object, mockUserService.Object); 
            ImageFile mockfile = new ImageFile();
            var bytes = Encoding.UTF8.GetBytes("This is a dummy file");
            mockfile.FileData = new FormFile(new MemoryStream(bytes), 0, bytes.Length, "", "TestImage");
            var result = service.UploadFile(mockfile, 1234);

            Assert.IsAssignableFrom<BaseFile>(result.Result);
        }
    }
}
