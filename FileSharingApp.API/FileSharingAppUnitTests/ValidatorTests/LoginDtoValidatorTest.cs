using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Validators;
using FluentValidation.TestHelper;
using Xunit;

namespace FileSharingAppUnitTests.ValidatorTests
{
    public class LoginDtoValidatorTest : BaseUnitTest
    {
        [Fact]
        public void Returns_validation_error_when_username_is_an_empty_string()
        {
            //Arrange
            var loginDtoValidator = new LoginDtoValidator();
            var loginDto = new LoginDto();
            loginDto.Username = "";

            //Act
            var result = loginDtoValidator.TestValidate(loginDto);

            //Assert
            result.ShouldHaveValidationErrorFor(loginDto => loginDto.Username);
        }

        [Fact]
        public void Does_not_return_validation_error_when_username_is_not_an_empty_string()
        {
            //Arrange
            var loginDtoValidator = new LoginDtoValidator();
            var loginDto = new LoginDto();
            loginDto.Username = "James123";

            //Act
            var result = loginDtoValidator.TestValidate(loginDto);

            //Assert
            result.ShouldNotHaveValidationErrorFor(loginDto => loginDto.Username);
        }

        [Fact]
        public void Returns_validation_error_when_password_is_an_empty_string()
        {
            //Arrange
            var loginDtoValidator = new LoginDtoValidator();
            var loginDto = new LoginDto();
            loginDto.Password = "";

            //Act
            var result = loginDtoValidator.TestValidate(loginDto);

            //Assert
            result.ShouldHaveValidationErrorFor(loginDto => loginDto.Password);
        }

        [Fact]
        public void Does_not_return_validation_error_when_password_is_not_an_empty_string()
        {
            //Arrange
            var loginDtoValidator = new LoginDtoValidator();
            var loginDto = new LoginDto();
            loginDto.Password = "Pa$$w0rd";

            //Act
            var result = loginDtoValidator.TestValidate(loginDto);

            //Assert
            result.ShouldNotHaveValidationErrorFor(loginDto => loginDto.Password);
        }
    }
}
