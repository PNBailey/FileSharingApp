using FileSharingApp.API.Controllers;
using FileSharingApp.API.Services.Interfaces;
using Moq;

namespace FileSharingAppUnitTests.Helpers
{
    internal static class UserControllerGenerator
    {
        internal static UserController GenerateUserController()
        {
            var mockUserService = MockUserServiceGenerator.GenerateMockUserService();
            var mockFileService = MockFileServiceGenerator.GenerateMockFileService();
            var userController = new UserController(mockUserService.Object, mockFileService.Object)
            {
                ControllerContext = ControllerContextGenerator.GenerateControllerContext()
            };
            return userController;
        }

        internal static UserController GenerateUserController(Mock<IFileService> mockFileService)
        {
            var mockUserService = MockUserServiceGenerator.GenerateMockUserService();
            var userController = new UserController(mockUserService.Object, mockFileService.Object)
            {
                ControllerContext = ControllerContextGenerator.GenerateControllerContext()
            };
            return userController;
        }

        internal static UserController GenerateUserController(Mock<IUserService> mockUserService)
        {
            var mockFileService = MockFileServiceGenerator.GenerateMockFileService();
            var userController = new UserController(mockUserService.Object, mockFileService.Object)
            {
                ControllerContext = ControllerContextGenerator.GenerateControllerContext()
            };
            return userController;
        }
    }
}
