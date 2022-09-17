using FileSharingApp.API.Models.DTOs;
using FileSharingAppUnitTests.Helpers;
using FluentValidation.TestHelper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
            var registerDtoValidator = new RegisterDtoValidator(mockUserManager.Object);
            var registerDto = new RegisterDto();
            registerDto.Username = "";

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
            var registerDtoValidator = new RegisterDtoValidator(mockUserManager.Object);
            var registerDto = new RegisterDto();
            registerDto.Username = "James123";

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
            var registerDtoValidator = new RegisterDtoValidator(mockUserManager.Object);
            var registerDto = new RegisterDto();
            registerDto.Password = "";

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
            var registerDtoValidator = new RegisterDtoValidator(mockUserManager.Object);
            var registerDto = new RegisterDto();
            registerDto.Password = "Pa$$w0rd";

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
            var registerDtoValidator = new RegisterDtoValidator(mockUserManager.Object);
            var registerDto = new RegisterDto();
            registerDto.Email = "";

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
            var registerDtoValidator = new RegisterDtoValidator(mockUserManager.Object);
            var registerDto = new RegisterDto();
            registerDto.Email = "25tommy@gmail.com";

            //Act
            var result = await registerDtoValidator.TestValidateAsync(registerDto);

            //Assert
            result.ShouldNotHaveValidationErrorFor(registerDto => registerDto.Email);
        }
    }
}
