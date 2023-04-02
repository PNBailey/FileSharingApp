using FileSharingApp.API.CustomExceptions;
using FileSharingApp.API.Models;
using FileSharingApp.API.Services.Interfaces;
using FileSharingAppUnitTests.Helpers.ModelMocks;
using FileSharingAppUnitTests.TestClasses;
using FileSharingAppUnitTests.TestData;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace FileSharingAppUnitTests.Helpers
{
    internal static class MockUserServiceGenerator
    {
        internal static Mock<IUserService> GenerateMockUserService(AppUser mockUser)
        {
            Mock<IUserService> mockUserService = SetupMockUserService(mockUser);
            return mockUserService;
        }

        internal static Mock<IUserService> GenerateMockUserService()
        {
            var mockUser = MockUserGenerator.GenerateMockUser();
            Mock<IUserService> mockUserService = SetupMockUserService(mockUser);
            return mockUserService;
        }

        private static Mock<IUserService> SetupMockUserService(AppUser mockUser)
        {
            var userTask = Task.FromResult(mockUser);
            var mockUserService = new Mock<IUserService>();
            var identityResult = IdentityResult.Success;
            var identityResultTask = Task.FromResult(identityResult);
            var mockUserDto = MockUserDtoGenerator.GenerateMockUserDto();
            var exceptions = new List<UserManagerCreateUserException>
            {
                new UserManagerCreateUserException("Test Error"),
                new UserManagerCreateUserException("Test Error 2")
            };
            var aggregateException = new AggregateException("User creation failed.", exceptions);

            mockUserService.Setup(x => x.UpdateUser(It.IsAny<AppUser>())).Returns(identityResultTask);
            mockUserService.Setup(x => x.AttemptToCreateUser(It.IsAny<AppUser>(), It.IsAny<string>())).Returns(identityResultTask);
            mockUserService.Setup(x => x.FindByIdAsync(It.IsAny<int>())).Returns(userTask);
            mockUserService.Setup(x => x.CheckUserDoesNotAlreadyExistByEmail(It.IsAny<string>(), It.IsAny<CancellationToken>())).Returns(Task.FromResult(true));
            mockUserService.Setup(x => x.CheckUserDoesNotAlreadyExistByName(It.IsAny<string>(), It.IsAny<CancellationToken>())).Returns(Task.FromResult(true));
            mockUserService.Setup(x => x.HandleSuccessfulUserCreation(It.IsAny<AppUser>())).Returns(Task.FromResult(mockUserDto));
            mockUserService.Setup(x => x.HandleUnsuccessfulUserCreation(It.IsAny<IEnumerable<IdentityError>>())).Returns(aggregateException);
            mockUserService.Setup(x => x.CreateUserDto(It.IsAny<AppUser>())).Returns(Task.FromResult(mockUserDto));
            mockUserService.Setup(x => x.SignIn(It.IsAny<AppUser>(), It.IsAny<string>())).Returns(Task.FromResult((SignInResult)new MockSignInResult(true)));

            return mockUserService;
        }
    }
}
