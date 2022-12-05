using FileSharingApp.API.Models.DTOs;
using FileSharingAppUnitTests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace FileSharingAppUnitTests
{
    public class AccountControllerUnitTests : BaseUnitTest
    {
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
            MockUserManagerGenerator.SetupCreateAsync(mockUserManager);
            var userService = UserServiceGenerator.CreateUserService(mockUserManager);
            var sut = AccountControllerGenerator.CreateAccountController(userService);

            //Act
            var actionResult = await sut.RegisterUser(registerDto);

            //Assert
            var result = actionResult.Result as OkObjectResult;
            Assert.IsType<UserDto>(result.Value);
        }
    }
}