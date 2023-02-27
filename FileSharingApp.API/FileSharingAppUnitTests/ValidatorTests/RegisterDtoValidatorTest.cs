using FileSharingApp.API.Models.DTOs;
using FileSharingAppUnitTests.Helpers;
using FluentValidation.TestHelper;
using Xunit;

namespace FileSharingAppUnitTests.ValidatorTests
{
    public class RegisterDtoValidatorTest : BaseUnitTest
    {
        [Fact]
        public async void Returns_validation_error_when_username_is_an_empty_string()
        {
            //Arrange
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var userService = UserServiceGenerator.CreateUserService(mockUserManager);
            var registerDto = new RegisterDto();
            registerDto.Username = "";
            var registerDtoValidator = new RegisterDtoValidator();

            //Act
            var result = await registerDtoValidator.TestValidateAsync(registerDto);

            //Assert
            result.ShouldHaveValidationErrorFor(registerDto => registerDto.Username);
        }

        [Fact]
        public async void Does_not_return_validation_error_when_username_is_not_an_empty_string()
        {
            //Arrange
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var userService = UserServiceGenerator.CreateUserService(mockUserManager);
            var registerDto = new RegisterDto();
            registerDto.Username = "James123";
            var registerDtoValidator = new RegisterDtoValidator();

            //Act
            var result = await registerDtoValidator.TestValidateAsync(registerDto);

            //Assert
            result.ShouldNotHaveValidationErrorFor(registerDto => registerDto.Username);
        }

        [Fact]
        public async void Returns_validation_error_when_password_is_an_empty_string()
        {
            //Arrange
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var userService = UserServiceGenerator.CreateUserService(mockUserManager);
            var registerDto = new RegisterDto();
            registerDto.Password = "";
            var registerDtoValidator = new RegisterDtoValidator();
            
            //Act
            var result = await registerDtoValidator.TestValidateAsync(registerDto);

            //Assert
            result.ShouldHaveValidationErrorFor(registerDto => registerDto.Password);
        }

        [Fact]
        public async void Does_not_return_validation_error_when_password_is_not_an_empty_string()
        {
            //Arrange
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var userService = UserServiceGenerator.CreateUserService(mockUserManager);
            var registerDto = new RegisterDto();
            registerDto.Password = "Pa$$w0rd";
            var registerDtoValidator = new RegisterDtoValidator();

            //Act
            var result = await registerDtoValidator.TestValidateAsync(registerDto);

            //Assert
            result.ShouldNotHaveValidationErrorFor(registerDto => registerDto.Password);
        }

        [Fact]
        public async void Returns_validation_error_when_email_is_an_empty_string()
        {
            //Arrange
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var userService = UserServiceGenerator.CreateUserService(mockUserManager);
            var registerDto = new RegisterDto();
            registerDto.Email = "";
            var registerDtoValidator = new RegisterDtoValidator();

            //Act
            var result = await registerDtoValidator.TestValidateAsync(registerDto);

            //Assert
            result.ShouldHaveValidationErrorFor(registerDto => registerDto.Email);
        }

        [Fact]
        public async void Does_not_return_validation_error_when_email_is_not_an_empty_string()
        {
            //Arrange
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var userService = UserServiceGenerator.CreateUserService(mockUserManager);
            var registerDto = new RegisterDto();
            registerDto.Email = "25tommy@gmail.com";
            var registerDtoValidator = new RegisterDtoValidator();

            //Act
            var result = await registerDtoValidator.TestValidateAsync(registerDto);

            //Assert
            result.ShouldNotHaveValidationErrorFor(registerDto => registerDto.Email);
        }
    }
}
