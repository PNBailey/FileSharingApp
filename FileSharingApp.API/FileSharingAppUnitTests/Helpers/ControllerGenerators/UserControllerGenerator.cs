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
            var mockPhotoService = MockPhotoServiceGenerator.GenerateMockPhotoService();
            var userController = new UserController(mockUserService.Object, mockPhotoService.Object)
            {
                ControllerContext = ControllerContextGenerator.GenerateControllerContext()
            };
            return userController;
        }

        internal static UserController GenerateUserController(Mock<IPhotoService> mockPhotoService)
        {
            var mockUserService = MockUserServiceGenerator.GenerateMockUserService();
            var userController = new UserController(mockUserService.Object, mockPhotoService.Object)
            {
                ControllerContext = ControllerContextGenerator.GenerateControllerContext()
            };
            return userController;
        }

        internal static UserController GenerateUserController(Mock<IUserService> mockUserService)
        {
            var mockPhotoService = MockPhotoServiceGenerator.GenerateMockPhotoService();
            var userController = new UserController(mockUserService.Object, mockPhotoService.Object)
            {
                ControllerContext = ControllerContextGenerator.GenerateControllerContext()
            };
            return userController;
        }
    }
}
