using AutoMapper;
using FileSharingApp.API.Controllers;
using FileSharingApp.API.Services.Interfaces;
using Moq;

namespace FileSharingAppUnitTests.Helpers
{
    internal static class UserControllerGenerator
    {
        internal static UserController GenerateUserController()
        {
            MapperConfiguration mapperConfiguration = AutoMapperTestConfigGenerator.GenerateTestMapperConfig();
            Mapper autoMapper = new Mapper(mapperConfiguration);
            var mockUserService = MockUserServiceGenerator.GenerateMockUserService();
            var mockFileService = MockFileServiceGenerator.GenerateMockFileService();
            var userController = new UserController(mockUserService.Object, mockFileService.Object, autoMapper)
            {
                ControllerContext = ControllerContextGenerator.GenerateControllerContext()
            };
            return userController;
        }

        internal static UserController GenerateUserController(Mock<IFileService> mockFileService)
        {
            MapperConfiguration mapperConfiguration = AutoMapperTestConfigGenerator.GenerateTestMapperConfig();
            Mapper autoMapper = new Mapper(mapperConfiguration);
            var mockUserService = MockUserServiceGenerator.GenerateMockUserService();
            var userController = new UserController(mockUserService.Object, mockFileService.Object, autoMapper)
            {
                ControllerContext = ControllerContextGenerator.GenerateControllerContext()
            };
            return userController;
        }

        internal static UserController GenerateUserController(Mock<IUserService> mockUserService)
        {
            MapperConfiguration mapperConfiguration = AutoMapperTestConfigGenerator.GenerateTestMapperConfig();
            Mapper autoMapper = new Mapper(mapperConfiguration);
            var mockFileService = MockFileServiceGenerator.GenerateMockFileService();
            var userController = new UserController(mockUserService.Object, mockFileService.Object, autoMapper)
            {
                ControllerContext = ControllerContextGenerator.GenerateControllerContext()
            };
            return userController;
        }
    }
}
