using FileSharingApp.API.Controllers;
using FileSharingApp.API.Models;
using FileSharingApp.API.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace FileSharingAppUnitTests.Helpers
{
    internal static class UserControllerGenerator
    {
        internal static UserController GenerateUserController()
        {
            var mockUserService = MockUserServiceGenerator.GenerateMockUserService();
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var mockPhotoService = MockPhotoServiceGenerator.GenerateMockPhotoService();
            var userController = new UserController(mockUserService.Object, mockPhotoService.Object, mockUserManager.Object)
            {
                ControllerContext = ControllerContextGenerator.GenerateControllerContext()
            };
            return userController;
        }

        internal static UserController GenerateUserController(Mock<IPhotoService> mockPhotoService)
        {
            var mockUserService = MockUserServiceGenerator.GenerateMockUserService();
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var userController = new UserController(mockUserService.Object, mockPhotoService.Object, mockUserManager.Object)
            {
                ControllerContext = ControllerContextGenerator.GenerateControllerContext()
            };
            return userController;
        }

        internal static UserController GenerateUserController(Mock<UserManager<AppUser?>> mockUserManager)
        {
            var mockUserService = MockUserServiceGenerator.GenerateMockUserService();
            var mockPhotoService = MockPhotoServiceGenerator.GenerateMockPhotoService();
            var userController = new UserController(mockUserService.Object, mockPhotoService.Object, mockUserManager.Object)
            {
                ControllerContext = ControllerContextGenerator.GenerateControllerContext()
            };
            return userController;
        }

        internal static UserController GenerateUserController(Mock<IUserService> mockUserService)
        {
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var mockPhotoService = MockPhotoServiceGenerator.GenerateMockPhotoService();
            var userController = new UserController(mockUserService.Object, mockPhotoService.Object, mockUserManager.Object)
            {
                ControllerContext = ControllerContextGenerator.GenerateControllerContext()
            };
            return userController;
        }
    }
}
