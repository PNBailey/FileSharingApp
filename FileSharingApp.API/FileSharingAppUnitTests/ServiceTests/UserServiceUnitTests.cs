using FileSharingApp.API.CustomExceptions;
using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingAppUnitTests.Helpers;
using FileSharingAppUnitTests.Helpers.ModelMocks;
using FileSharingAppUnitTests.TestData;
using Microsoft.AspNetCore.Identity;
using Moq;
using Xunit;

namespace FileSharingAppUnitTests.ServiceTests
{
    public class UserServiceUnitTests : BaseUnitTest
    {
        [Theory]
        [InlineData("test1@gmail.com")]
        [InlineData("test2@gmail.com")]
        [InlineData("test3@gmail.com")]
        public async void CheckUserDoesNotAlreadyExistByEmail_should_return_true_when_email_addresses_do_not_exist(string email)
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            MockUserManagerGenerator.SetupFindByEmailAsync(mockUserManager, email);
            var sut = UserServiceGenerator.CreateUserService(mockUserManager);

            //Act
            var result = await sut.CheckUserDoesNotAlreadyExistByEmail(email, new CancellationToken());

            //Assert
            Assert.True(result);
        }

        [Theory]
        [InlineData("paul")]
        [InlineData("gregg")]
        [InlineData("dave")]
        public async void CheckUserDoesNotAlreadyExistByName_should_return_false_when_usernames_exist(string username)
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            MockUserManagerGenerator.SetupFindByNameAsync(mockUserManager, username);
            var sut = UserServiceGenerator.CreateUserService(mockUserManager);

            //Act
            var result = await sut.CheckUserDoesNotAlreadyExistByName(username, new CancellationToken());

            //Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("Jimmy@gmail.com")]
        [InlineData("52Pete@gmail.com")]
        [InlineData("Lorraine2@gmail.com")]
        public async void CheckUserDoesNotAlreadyExistByEmail_should_return_false_when_email_addresses_exist(string email)
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            MockUserManagerGenerator.SetupFindByEmailAsync(mockUserManager, email);
            var sut = UserServiceGenerator.CreateUserService(mockUserManager);

            //Act
            var result = await sut.CheckUserDoesNotAlreadyExistByEmail(email, new CancellationToken());

            //Assert
            Assert.False(result);
        }

        [Fact]
        public async void AttemptToCreateUser_should_return_an_identity_result()
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            MockUserManagerGenerator.SetupCreateAsyncSuccess(mockUserManager);
            var sut = UserServiceGenerator.CreateUserService(mockUserManager);
            var user = MockUserGenerator.GenerateMockUser();

            //Act
            var result = await sut.AttemptToCreateUser(user, "Pa$$w0rd");

            //Assert
            Assert.IsType<IdentityResult>(result);
        }
        
        [Fact]
        public async void AttemptToCreateUser_should_return_an_identity_result_which_is_successful_when_user_manager_createAsync_is_successful()
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            MockUserManagerGenerator.SetupCreateAsyncSuccess(mockUserManager);
            var sut = UserServiceGenerator.CreateUserService(mockUserManager);
            var user = MockUserGenerator.GenerateMockUser();

            //Act
            var result = await sut.AttemptToCreateUser(user, "Pa$$w0rd");

            //Assert
            Assert.True(result.Succeeded);
        }
        
        [Fact]
        public async void AttemptToCreateUser_should_return_an_identity_result_which_contains_errors_when_user_manager_createAsync_returns_errors()
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            MockUserManagerGenerator.SetupCreateAsyncFailure(mockUserManager);
            var sut = UserServiceGenerator.CreateUserService(mockUserManager);
            var user = MockUserGenerator.GenerateMockUser();

            //Act
            var result = await sut.AttemptToCreateUser(user, "Pa$$w0rd");

            //Assert
            Assert.True(result.Errors.Any());
        }

        [Fact]
        public void HandleUnsuccessfulUserCreation_should_return_aggregate_exception()
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var sut = UserServiceGenerator.CreateUserService(mockUserManager);
            var identityErrors = new List<IdentityError>();
            identityErrors.Add(new IdentityError());
            identityErrors.Add(new IdentityError());

            //Act
            var result = sut.HandleUnsuccessfulUserCreation(identityErrors);

            //Assert
            Assert.IsType<AggregateException>(result);
        }
        
        [Fact]
        public async void HandleSuccessfulUserCreation_should_return_a_user_dto()
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var sut = UserServiceGenerator.CreateUserService(mockUserManager);
            var user = MockUserGenerator.GenerateMockUser();

            //Act
            var result = await sut.HandleSuccessfulUserCreation(user);

            //Assert
            Assert.IsType<UserDto>(result);
        }

        [Fact]
        public async void FindByNameAsync_should_throw_UserNotFoundException_when_userManager_FindByNameAsync_returns_null()
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            MockUserManagerGenerator.SetupFindByNameAsync(mockUserManager, "steve");
            var sut = UserServiceGenerator.CreateUserService(mockUserManager);

            //Act
            try
            {
                var result = await sut.FindByNameAsync("steve");
            }

            //Assert
            catch(Exception ex)
            {
                Assert.IsType<UserNotFoundException>(ex);
            }
        }

        [Fact]
        public async void FindByNameAsync_should_return_user_when_userManager_FindByNameAsync_returns_user()
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            MockUserManagerGenerator.SetupFindByNameAsync(mockUserManager, "jimmy");
            var sut = UserServiceGenerator.CreateUserService(mockUserManager);

            //Act
            var result = await sut.FindByNameAsync("jimmy");

            //Assert
            Assert.IsType<AppUser>(result);
            Assert.Equal("jimmy", result.UserName);
            Assert.Equal("Jimmy@gmail.com", result.Email);
            Assert.Equal(6, result.Id);
        }

        [Fact]
        public async void FindByIdAsync_should_throw_UserNotFoundException_when_userManager_FindByIdAsync_returns_null()
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            MockUserManagerGenerator.SetupFindByIdAsync(mockUserManager, 10);
            var sut = UserServiceGenerator.CreateUserService(mockUserManager);

            //Act
            try
            {
                var result = await sut.FindByIdAsync(10);
            }

            //Assert
            catch(Exception ex)
            {
                Assert.IsType<UserNotFoundException>(ex);
            }
        }

        [Fact]
        public async void FindByIdAsync_should_return_user_when_userManager_FindByIdAsync_returns_user()
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            MockUserManagerGenerator.SetupFindByIdAsync(mockUserManager, 6);
            var sut = UserServiceGenerator.CreateUserService(mockUserManager);

            //Act
            var result = await sut.FindByIdAsync(6);

            //Assert
            Assert.IsType<AppUser>(result);
            Assert.Equal("jimmy", result.UserName);
            Assert.Equal("Jimmy@gmail.com", result.Email);
            Assert.Equal(6, result.Id);
        }

        [Fact]
        public async void UpdateUser_calls_userManager_updateAsync_method()
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            MockUserManagerGenerator.SetupFindByIdAsync(mockUserManager, 6);
            MockUserManagerGenerator.SetupUpdateAsync(mockUserManager);
            var sut = UserServiceGenerator.CreateUserService(mockUserManager);
            var mockUser = MockUsersData.TestData.Find(user => user.Id == 6);

            //Act
            var result = await sut.UpdateUser(mockUser);

            //Assert
            mockUserManager.Verify(x => x.UpdateAsync(mockUser), Times.Once);
        }

        [Fact]
        public async void UpdateUser_returns_an_identity_result()
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            MockUserManagerGenerator.SetupFindByIdAsync(mockUserManager, 6);
            MockUserManagerGenerator.SetupUpdateAsync(mockUserManager);
            var sut = UserServiceGenerator.CreateUserService(mockUserManager);

            //Act
            var result = await sut.UpdateUser(MockUserGenerator.GenerateMockUser());

            //Assert
            Assert.IsType<IdentityResult>(result);
        }

        [Fact]
        public async void SignIn_returns_a_SignInResult()
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var sut = UserServiceGenerator.CreateUserService(mockUserManager);

            //Act
            var result = await sut.SignIn(MockUserGenerator.GenerateMockUser(), "Pa$$w0rd");

            //Assert
            Assert.IsType<SignInResult>(result);
        }
    }
}
