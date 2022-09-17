using AutoMapper;
using FileSharingApp.API.Controllers;
using FileSharingApp.API.Helpers;
using FileSharingApp.API.Models;
using FileSharingAppUnitTests.TestData;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Moq;

namespace FileSharingAppUnitTests.Helpers
{
    internal static class MockAccountControllerGenerator
    {
        public static AccountController CreateAccountController(Mock<UserManager<AppUser?>> mockUserManager)
        {
            var mockSignInManager = MockSignInManagerGenerator.CreateMockSignInManager(mockUserManager);

            var mockAutoMapper = MockAutoMapperGenerator.CreateAutoMapper();
            var mockConfig = MockConfiguratonGenerator.GenerateMockConfiguration();
            var mockJWTTokenGenerator = new Mock<JWTTokenGenerator>(mockUserManager.Object, mockConfig);

            var accountController = new AccountController(
                mockUserManager.Object,
                mockSignInManager.Object,
                mockAutoMapper,
                mockConfig,
                mockJWTTokenGenerator.Object
            );

            return accountController;
        }
    }
}
