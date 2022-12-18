using FileSharingApp.API.CustomExceptions;
using FileSharingApp.API.Models.DTOs;
using FileSharingAppUnitTests.Helpers;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace FileSharingAppUnitTests
{
    public class AccountControllerUnitTests : BaseUnitTest
    {

        [Fact]
        public async void CheckUsernameUnique_should_return_true_when_user_does_not_exist()
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            MockUserManagerGenerator.SetupFindByNameAsync(mockUserManager, "jack");
            var userService = UserServiceGenerator.CreateUserService(mockUserManager);
            var sut = AccountControllerGenerator.CreateAccountController(userService);

            //Act
            var actionResult = await sut.CheckUsernameUnique("jack");

            //Assert
            var result = actionResult.Result as OkObjectResult;
            Assert.True((bool)result!.Value!);
        }

        [Fact]
        public async void CheckEmailUnique_should_return_true_when_user_does_not_exist()
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            MockUserManagerGenerator.SetupFindByEmailAsync(mockUserManager, "test@gmail.com");
            var userService = UserServiceGenerator.CreateUserService(mockUserManager);
            var sut = AccountControllerGenerator.CreateAccountController(userService);

            //Act
            var actionResult = await sut.CheckEmailUnique("test@gmail.com");

            //Assert
            var result = actionResult.Result as OkObjectResult;
            Assert.True((bool)result!.Value!);
        }

        [Fact]
        public async void RegisterUser_should_return_a_userDto_when_register_Dto_is_valid()
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var registerDto = new RegisterDto();
            registerDto.Username = "Paud";
            registerDto.Password = "Pa$$w0rd";
            registerDto.Email = "TestEmail@gmail.com";
            MockUserManagerGenerator.SetupFindByNameAsync(mockUserManager, registerDto.Username);
            MockUserManagerGenerator.SetupFindByEmailAsync(mockUserManager, registerDto.Email);
            MockUserManagerGenerator.SetupCreateAsyncSuccess(mockUserManager);
            var userService = UserServiceGenerator.CreateUserService(mockUserManager);
            var sut = AccountControllerGenerator.CreateAccountController(userService);

            //Act
            var actionResult = await sut.RegisterUser(registerDto);

            //Assert
            var result = actionResult.Result as OkObjectResult;
            Assert.IsType<UserDto>(result!.Value);
        }

        [Fact]
        public async void RegisterUser_should_return_an_AggregateException_when_user_creation_is_unsuccessful()
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var registerDto = new RegisterDto();
            registerDto.Username = "Paud";
            registerDto.Password = "Pa$$w0rd";
            registerDto.Email = "TestEmail@gmail.com";
            MockUserManagerGenerator.SetupFindByNameAsync(mockUserManager, registerDto.Username);
            MockUserManagerGenerator.SetupFindByEmailAsync(mockUserManager, registerDto.Email);
            MockUserManagerGenerator.SetupCreateAsyncFailure(mockUserManager);
            var userService = UserServiceGenerator.CreateUserService(mockUserManager);
            var sut = AccountControllerGenerator.CreateAccountController(userService);

            //Assert
            await Assert.ThrowsAsync<AggregateException>(() => sut.RegisterUser(registerDto));
        }

        [Fact]
        public async void RegisterUser_should_return_an_AggregateException_containing_a_list_of_UserManagerCreateUserExceptions_when_user_creation_is_unsuccessful()
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var registerDto = new RegisterDto();
            registerDto.Username = "pauly";
            registerDto.Password = "Pa$$w0rd";
            registerDto.Email = "TestEmail@gmail.com";
            MockUserManagerGenerator.SetupFindByNameAsync(mockUserManager, registerDto.Username);
            MockUserManagerGenerator.SetupFindByEmailAsync(mockUserManager, registerDto.Email);
            MockUserManagerGenerator.SetupCreateAsyncFailure(mockUserManager);
            var userService = UserServiceGenerator.CreateUserService(mockUserManager);
            var sut = AccountControllerGenerator.CreateAccountController(userService);

            //Act
            try
            {
                await sut.RegisterUser(registerDto);
            }

            //Assert
            catch (AggregateException aggregateException)
            {
                foreach (var exception in aggregateException.InnerExceptions.ToList())
                {
                    exception.Should().BeOfType<UserManagerCreateUserException>();
                }
            }
        }

        [Fact]
        public async void LoginUser_should_return_a_UserNotFoundException_when_User_Not_Found()
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var userService = UserServiceGenerator.CreateUserService(mockUserManager);
            var loginDto = new LoginDto();
            loginDto.Username = "Donna";
            loginDto.Password = "Pa$$w0rd";
            MockUserManagerGenerator.SetupFindByNameAsync(mockUserManager, loginDto.Username);
            var sut = AccountControllerGenerator.CreateAccountController(userService);

            //Assert
            await Assert.ThrowsAsync<UserNotFoundException>(() => sut.LoginUser(loginDto));
        }

        [Fact]
        public async void LoginUser_should_return_a_PasswordIncorrectException_when_User_Not_Found()
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var userService = UserServiceGenerator.CreateUserService(mockUserManager);
            var loginDto = new LoginDto();
            loginDto.Username = "paul";
            loginDto.Password = "Pa$$w0rd";
            MockUserManagerGenerator.SetupFindByNameAsync(mockUserManager, loginDto.Username);
            MockUserManagerGenerator.SetupCheckPasswordAsyncIncorrect(mockUserManager);
            var sut = AccountControllerGenerator.CreateAccountController(userService);

            //Assert
            await Assert.ThrowsAsync<PasswordIncorrectException>(() => sut.LoginUser(loginDto));
        }

        [Fact]
        public async void LoginUser_should_return_a_ok_response_when_User_Found_and_password_correct()
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var userService = UserServiceGenerator.CreateUserService(mockUserManager);
            var loginDto = new LoginDto();
            loginDto.Username = "paul";
            loginDto.Password = "Pa$$w0rd";
            MockUserManagerGenerator.SetupFindByNameAsync(mockUserManager, loginDto.Username);
            MockUserManagerGenerator.SetupCheckPasswordAsyncCorrect(mockUserManager);
            var sut = AccountControllerGenerator.CreateAccountController(userService);

            //Act
            var actionResult = await sut.LoginUser(loginDto);

            //Assert
            var result = actionResult.Result as OkObjectResult;
            result.Should().BeOfType<OkObjectResult>();
        }

        [Fact]
        public async void LoginUser_should_return_a_User_dto_response_when_User_Found_and_password_correct()
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var userService = UserServiceGenerator.CreateUserService(mockUserManager);
            var loginDto = new LoginDto();
            loginDto.Username = "paul";
            loginDto.Password = "Pa$$w0rd";
            MockUserManagerGenerator.SetupFindByNameAsync(mockUserManager, loginDto.Username);
            MockUserManagerGenerator.SetupCheckPasswordAsyncCorrect(mockUserManager);
            var sut = AccountControllerGenerator.CreateAccountController(userService);

            //Act
            var actionResult = await sut.LoginUser(loginDto);

            //Assert
            var result = actionResult.Result as OkObjectResult;
            result!.Value.Should().BeOfType<UserDto>();
        }
    }
}