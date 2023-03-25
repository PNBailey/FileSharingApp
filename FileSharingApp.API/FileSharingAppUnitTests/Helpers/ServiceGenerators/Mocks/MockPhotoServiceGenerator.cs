using CloudinaryDotNet.Actions;
using FileSharingApp.API.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Moq;

namespace FileSharingAppUnitTests.Helpers
{
    internal static class MockPhotoServiceGenerator
    {
        internal static Mock<IPhotoService> GenerateMockPhotoService()
        {
            var mockPhotoService = new Mock<IPhotoService>();
            var mockImageUploadResult = new ImageUploadResult();
            mockImageUploadResult.Error = null;
            mockPhotoService.Setup(x => x.UploadImage(It.IsAny<IFormFile>(), It.IsAny<int>())).Returns(mockImageUploadResult);
            return mockPhotoService;
        }
    }
}
