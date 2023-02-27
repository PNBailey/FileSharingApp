using AutoMapper;
using FileSharingApp.API.Controllers;
using FileSharingApp.API.Services;
using FileSharingApp.API.Services.Interfaces;
using Moq;

namespace FileSharingAppUnitTests.Helpers
{
    internal static class AccountControllerGenerator
    {
        public static AccountController CreateAccountController(UserService userService)
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
    }
}
