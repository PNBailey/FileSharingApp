using FileSharingApp.API.Models.Files;
using FileSharingApp.API.Services.Interfaces;
using Moq;

namespace FileSharingAppUnitTests.Helpers
{
    internal static class MockFileServiceGenerator
    {
        internal static Mock<IFileService> GenerateMockFileService()
        {
            var mockFileService = new Mock<IFileService>();
            var mockBaseFile = new Mock<BaseFile>();
            mockBaseFile.Object.Url = "https://Test/Url";
            var mockBaseFileTask = Task.FromResult(mockBaseFile.Object);
            mockFileService.Setup(x => x.UploadFile(It.IsAny<BaseFile>(), It.IsAny<int>())).Returns(mockBaseFileTask);
            return mockFileService;
        }
    }
}
