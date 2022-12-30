using AutoMapper;
using FileSharingApp.API.Controllers;
using FileSharingApp.API.Services;

namespace FileSharingAppUnitTests.Helpers
{
    internal static class AccountControllerGenerator
    {
        public static AccountController CreateAccountController(UserService userService)
        {
            MapperConfiguration mapperConfiguration = AutoMapperTestConfigGenerator.GenerateTestMapperConfig();

            Mapper autoMapper = new Mapper(mapperConfiguration);

            AccountController accountController = new AccountController(
                autoMapper,
                userService
            );

            return accountController;
        }
    }
}
