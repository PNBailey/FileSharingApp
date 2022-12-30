using FileSharingApp.API.CustomExceptions;
using FileSharingAppUnitTests.Helpers;
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
        public async void HandleUnsuccessfulUserCreation_should_return_aggregate_exception()
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
    }
}
