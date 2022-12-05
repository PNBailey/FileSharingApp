using FileSharingAppUnitTests.Helpers;
using Xunit;

namespace FileSharingAppUnitTests.ServiceTests
{
    public class UserServiceUnitTests
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

        //[Fact]
        //public async void LoginUser_should_return_a_Bad_Request_when_User_Not_Found()
        //{
        //    //Arrange 
        //    var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
        //    var userService = UserServiceGenerator.CreateUserService(mockUserManager);
        //    var loginDto = new LoginDto();
        //    loginDto.Username = "Donna";
        //    loginDto.Password = "Pa$$w0rd";
        //    MockUserManagerGenerator.SetupFindByNameAsync(mockUserManager, loginDto.Username);
        //    var sut = AccountControllerGenerator.CreateAccountController(mockUserManager, userService);

        //    //Act
        //    var actionResult = await sut.LoginUser(loginDto);

        //    //Assert
        //    var result = actionResult.Result as BadRequestObjectResult;
        //    Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
        //}
    }
}
