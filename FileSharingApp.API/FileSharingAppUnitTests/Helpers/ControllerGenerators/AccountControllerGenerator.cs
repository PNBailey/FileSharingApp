using AutoMapper;
using FileSharingApp.API.Controllers;
using FileSharingApp.API.Services;
using FileSharingApp.API.Services.Interfaces;
using Moq;

namespace FileSharingAppUnitTests.Helpers
{
    internal static class AccountControllerGenerator
    {
        internal static AccountController CreateAccountController(IUserService userService)
        {
            MapperConfiguration mapperConfiguration = AutoMapperTestConfigGenerator.GenerateTestMapperConfig();
            Mapper autoMapper = new Mapper(mapperConfiguration);

            Mock<IValidationService> mockValidationService = new Mock<IValidationService>();

            AccountController accountController = new AccountController(
                autoMapper,
                userService,
                mockValidationService.Object
            );

            return accountController;
        }
        
        internal static AccountController CreateAccountController(IUserService mockUserService, IValidationService mockValidationService)
        {
            MapperConfiguration mapperConfiguration = AutoMapperTestConfigGenerator.GenerateTestMapperConfig();
            Mapper autoMapper = new Mapper(mapperConfiguration);

            AccountController accountController = new AccountController(
                autoMapper,
                mockUserService,
                mockValidationService
            );

            return accountController;
        }   
        
        internal static AccountController CreateAccountController(IValidationService mockValidationService)
        {
            MapperConfiguration mapperConfiguration = AutoMapperTestConfigGenerator.GenerateTestMapperConfig();
            Mapper autoMapper = new Mapper(mapperConfiguration);

            var mockUserService = MockUserServiceGenerator.GenerateMockUserService();

            AccountController accountController = new AccountController(
                autoMapper,
                mockUserService.Object,
                mockValidationService
            );

            return accountController;
        }
    }
}
