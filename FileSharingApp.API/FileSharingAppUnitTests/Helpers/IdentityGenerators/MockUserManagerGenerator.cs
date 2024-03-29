﻿using FileSharingApp.API.Models;
using FileSharingAppUnitTests.TestData;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace FileSharingAppUnitTests.Helpers
{
    public static class MockUserManagerGenerator
    {
        public static Mock<UserManager<AppUser?>> CreateMockUserManager()
        {
            var mockUserManager = new Mock<UserManager<AppUser?>>(CreateIUserStoreMock().Object, null, null, null, null, null, null, null, null);

            SetupGetRolesAsync(mockUserManager);

            return mockUserManager;
        }

        private static void SetupGetRolesAsync(Mock<UserManager<AppUser?>> mockUserManager)
        {
            mockUserManager.Setup(x => x.GetRolesAsync(It.IsAny<AppUser>())).ReturnsAsync(getTestRoles());
        }

        private static List<string> getTestRoles()
        {
            var roles = new List<string>
            {
                "role 1",
                "role 2"
            };

            return roles;
        }

        public static void SetupDeleteAsync(Mock<UserManager<AppUser?>> mockUserManager)
        {
            mockUserManager.Setup(x => x.DeleteAsync(It.IsAny<AppUser>())).ReturnsAsync(IdentityResult.Success);
        }

        public static void SetupCreateAsyncSuccess(Mock<UserManager<AppUser?>> mockUserManager)
        {
            var mockUsers = MockUsersData.TestData;

            mockUserManager.Setup(x => x.CreateAsync(It.IsAny<AppUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success).Callback<AppUser, string>((x, y) => mockUsers.Add(x));
        }

        public static void SetupCreateAsyncFailure(Mock<UserManager<AppUser?>> mockUserManager)
        {
            var mockUsers = MockUsersData.TestData;
            mockUserManager.Setup(x => x.CreateAsync(It.IsAny<AppUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Failed(new IdentityError()));
        }

        public static void SetupUpdateAsync(Mock<UserManager<AppUser?>> mockUserManager)
        {
            mockUserManager.Setup(x => x.UpdateAsync(It.IsAny<AppUser>())).ReturnsAsync(IdentityResult.Success);
        }

        public static void SetupFindByNameAsync(Mock<UserManager<AppUser?>> mockUserManager, string username)
        {
            var mockUsers = MockUsersData.TestData;
            var user = mockUsers.Find(user => user.UserName == username);
            mockUserManager.Setup(x => x.FindByNameAsync(It.IsAny<string>())).ReturnsAsync(user);
        }

        public static void SetupFindByEmailAsync(Mock<UserManager<AppUser?>> mockUserManager, string email)
        {
            var mockUsers = MockUsersData.TestData;
            var user = mockUsers.Find(user => user.Email == email);
            mockUserManager.Setup(x => x.FindByEmailAsync(It.IsAny<string>())).ReturnsAsync(user);
        }
        
        public static void SetupFindByIdAsync(Mock<UserManager<AppUser?>> mockUserManager, int id)
        {
            var mockUsers = MockUsersData.TestData;
            var user = mockUsers.Find(user => user.Id == id);
            mockUserManager.Setup(x => x.FindByIdAsync(It.IsAny<string>())).ReturnsAsync(user);
        }

        public static void SetupCheckPasswordAsyncIncorrect(Mock<UserManager<AppUser?>> mockUserManager)
        {
            mockUserManager.Setup(x => x.CheckPasswordAsync(It.IsAny<AppUser>(), It.IsAny<string>())).ReturnsAsync("Pa$$w0rd" == "Password");
        }

        public static void SetupCheckPasswordAsyncCorrect(Mock<UserManager<AppUser?>> mockUserManager)
        {
            mockUserManager.Setup(x => x.CheckPasswordAsync(It.IsAny<AppUser>(), It.IsAny<string>())).ReturnsAsync("Pa$$w0rd" == "Pa$$w0rd");
        }

        private static Mock<IUserStore<AppUser>> CreateIUserStoreMock()
        {
            var mockIUserStore = new Mock<IUserStore<AppUser>>();
            return mockIUserStore;
        }
    }
}
