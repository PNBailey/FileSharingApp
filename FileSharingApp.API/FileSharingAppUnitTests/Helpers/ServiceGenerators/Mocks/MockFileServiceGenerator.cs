using CloudinaryDotNet.Actions;
using FileSharingApp.API.Models.Interfaces;
using FileSharingApp.API.Services.Interfaces;
using Moq;

namespace FileSharingAppUnitTests.Helpers
{
    internal static class MockFileServiceGenerator
    {
        internal static Mock<IFileService> GenerateMockFileService()
        {
            var mockFileService = new Mock<IFileService>();
            var mockFileUploadResult = new RawUploadResult();
            mockFileUploadResult.Error = null;
            mockFileUploadResult.Url = new Uri("https://Test/Url");
            mockFileService.Setup(x => x.UploadFile(It.IsAny<IFile>(), It.IsAny<int>())).Returns(mockFileUploadResult);
            return mockFileService;
        }
    }
}
