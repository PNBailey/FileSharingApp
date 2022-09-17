using FileSharingApp.API.Models;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace FileSharingAppUnitTests.Helpers
{
    public static class MockUserManagerGenerator
    {
        //private List<AppUser> _mockUsers;
        //private Mock<UserManager<AppUser?>> _mockUserManager = null!;

        //public MockUserManagerGenerator(List<AppUser> mockUsers)
        //{
        //    _mockUsers = mockUsers;
        //}

        public static Mock<UserManager<AppUser?>> CreateMockUserManager()
        {
            var mockUserManager = new Mock<UserManager<AppUser?>>(CreateIUserStoreMock().Object, null, null, null, null, null, null, null, null);

            //AddUserValidator();
            //AddPasswordValidator();
            //SetupDeleteAsync();
            //SetupCreateAsync();
            //SetupUpdateAsync();
            SetupGetRolesAsync(mockUserManager);

            return mockUserManager;
        }

        private static void SetupGetRolesAsync(Mock<UserManager<AppUser?>> mockUserManager)
        {
            mockUserManager.Setup(x => x.GetRolesAsync(It.IsAny<AppUser>())).ReturnsAsync(getTestRoles());
        }

        //private static void SetupDeleteAsync(Mock<UserManager<AppUser?>> mockUserManager)
        //{
        //    mockUserManager.Setup(x => x.DeleteAsync(It.IsAny<AppUser>())).ReturnsAsync(IdentityResult.Success);
        //}

        //private static void SetupCreateAsync(Mock<UserManager<AppUser?>> mockUserManager, List<AppUser> mockUsers)
        //{
        //    mockUserManager.Setup(x => x.CreateAsync(It.IsAny<AppUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success).Callback<AppUser, string>((x, y) => mockUsers.Add(x));
        //}

        //private static void SetupUpdateAsync(Mock<UserManager<AppUser?>> mockUserManager)
        //{
        //    mockUserManager.Setup(x => x.UpdateAsync(It.IsAny<AppUser>())).ReturnsAsync(IdentityResult.Success);
        //}

        private static Mock<IUserStore<AppUser>> CreateIUserStoreMock()
        {
            var mockIUserStore = new Mock<IUserStore<AppUser>>();
            return mockIUserStore;
        }

        //private static void AddUserValidator(Mock<UserManager<AppUser?>> mockUserManager)
        //{
        //    mockUserManager.Object.UserValidators.Add(new UserValidator<AppUser?>());
        //}

        //private static void AddPasswordValidator(Mock<UserManager<AppUser?>> mockUserManager)
        //{
        //    mockUserManager.Object.PasswordValidators.Add(new PasswordValidator<AppUser?>());
        //}

        public static List<string> getTestRoles()
        {
            var roles = new List<string>();

            return roles;
        }
    }
}
