using FileSharingApp.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace FileSharingAppUnitTests.Helpers
{
    internal static class MockSignInManagerGenerator
    {
        internal static Mock<SignInManager<AppUser>> CreateMockSignInManager(Mock<UserManager<AppUser?>> mockUserManager)
        {
            var mockSignInManager = new Mock<SignInManager<AppUser>>(mockUserManager.Object, CreateMockIHttpContextAccessor().Object, CreateMockIUserClaimsPrincipalFactory().Object, null, null, null, null);

            return mockSignInManager;
        }

        private static Mock<IHttpContextAccessor> CreateMockIHttpContextAccessor()
        {
            return new Mock<IHttpContextAccessor>();
        }

        private static Mock<IUserClaimsPrincipalFactory<AppUser>> CreateMockIUserClaimsPrincipalFactory()
        {
            return new Mock<IUserClaimsPrincipalFactory<AppUser>>();
        }
    }
}
