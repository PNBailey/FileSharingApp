using FileSharingApp.API.Helpers;
using FileSharingApp.API.Models;
using FileSharingApp.API.Services;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace FileSharingAppUnitTests.Helpers
{
    internal static class UserServiceGenerator
    {
        internal static UserService CreateUserService(Mock<UserManager<AppUser?>> mockUserManager)
        {
            var autoMapper = AutoMapperGenerator.CreateAutoMapper();
            var config = ConfiguratonGenerator.GenerateConfiguration();
            var jwtTokenGenerator = new JWTTokenGenerator(mockUserManager.Object, config);
            return new UserService(mockUserManager.Object, autoMapper, jwtTokenGenerator);
        }
    }
}
