using FileSharingApp.API.Controllers;
using FileSharingApp.API.Models;
using FileSharingApp.API.Services;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace FileSharingAppUnitTests.Helpers
{
    internal static class AccountControllerGenerator
    {
        public static AccountController CreateAccountController(UserService userService)
        {
            var autoMapper = AutoMapperGenerator.CreateAutoMapper();

            var accountController = new AccountController(
                autoMapper,
                userService
            );

            return accountController;
        }
    }
}
