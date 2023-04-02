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
            Uri mockUri;
            //mockUri.TryCreate("http:///Test//Url", UriKind.Absolute, out mockUri);
            var mockImageUploadResult = new ImageUploadResult();
            mockImageUploadResult.Error = null;
            mockImageUploadResult.Url = new Uri("https://Test/Url");
            mockPhotoService.Setup(x => x.UploadImage(It.IsAny<IFormFile>(), It.IsAny<int>())).Returns(mockImageUploadResult);
            return mockPhotoService;
        }
    }
}
