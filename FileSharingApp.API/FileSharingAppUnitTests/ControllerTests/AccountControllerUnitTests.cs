using AutoFixture;
using FileSharingApp.API.Controllers;
using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingAppUnitTests.Helpers;
using FileSharingAppUnitTests.TestData;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Collections.Generic;
using System.Net;
using Xunit;

namespace FileSharingAppUnitTests
{
    public class AccountControllerUnitTests : BaseUnitTest
    {
        [Theory]
        [InlineData("paul")]
        [InlineData("gregg")]
        [InlineData("dave")]
        public async void CheckUsernameUnique_should_return_false_when_usernames_exist(string username)
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var mockUsers = MockUsersData.TestData;
            var user = mockUsers.Find(user => user.UserName == username);
            mockUserManager.Setup(x => x.FindByNameAsync(It.IsAny<string>())).ReturnsAsync(user);
            var sut = MockAccountControllerGenerator.CreateAccountController(mockUserManager);

            //Act
            var result = await sut.CheckUsernameUnique(username);

            //Assert
            Assert.False(result.Value);
        }

        [Theory]
        [InlineData("tommy")]
        [InlineData("albert")]
        [InlineData("caroline")]
        public async void CheckUsernameUnique_should_return_true_when_usernames_do_not_exist(string username)
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var mockUsers = MockUsersData.TestData;
            var user = mockUsers.Find(user => user.UserName == username);
            mockUserManager.Setup(x => x.FindByNameAsync(It.IsAny<string>())).ReturnsAsync(user);
            var sut = MockAccountControllerGenerator.CreateAccountController(mockUserManager);

            //Act
            var result = await sut.CheckUsernameUnique(username);

            //Assert
            Assert.True(result.Value);
        }

        [Theory]
        [InlineData("Jimmy@gmail.com")]
        [InlineData("52Pete@gmail.com")]
        [InlineData("Lorraine2@gmail.com")]
        public async void CheckEmailUnique_should_return_false_when_email_addresses_exist(string email)
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var mockUsers = MockUsersData.TestData;
            var user = mockUsers.Find(user => user.Email == email);
            mockUserManager.Setup(x => x.FindByEmailAsync(It.IsAny<string>())).ReturnsAsync(user);
            var sut = MockAccountControllerGenerator.CreateAccountController(mockUserManager);

            //Act
            var result = await sut.CheckEmailUnique(email);

            //Assert
            Assert.False(result.Value);
        }

        [Theory]
        [InlineData("test1@gmail.com")]
        [InlineData("test2@gmail.com")]
        [InlineData("test3@gmail.com")]
        public async void CheckEmailUnique_should_return_true_when_email_addresses_do_not_exist(string email)
        {
            //Arrange 
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var mockUsers = MockUsersData.TestData;
            var user = mockUsers.Find(user => user.Email == email);
            mockUserManager.Setup(x => x.FindByEmailAsync(It.IsAny<string>())).ReturnsAsync(user);
            var sut = MockAccountControllerGenerator.CreateAccountController(mockUserManager);

            //Act
            var result = await sut.CheckEmailUnique(email);

            //Assert
            Assert.True(result.Value);
        }

        [Fact]
        public async void RegisterUser_should_return_a_userDto_when_register_Dto_is_valid()
        {
            //Arrange 
            var mockUsers = MockUsersData.TestData;
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            mockUserManager.Setup(x => x.CreateAsync(It.IsAny<AppUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success).Callback<AppUser, string>((x, y) => mockUsers.Add(x));
            var sut = MockAccountControllerGenerator.CreateAccountController(mockUserManager);
            var registerDto = new RegisterDto();
            registerDto.Username = "Paul";
            registerDto.Password = "Pa$$w0rd";
            registerDto.Email = "TestEmail@gmail.com";

            //Act
            var actionResult = await sut.RegisterUser(registerDto);

            //Assert
            var result = actionResult.Result as OkObjectResult;
            Assert.IsType<UserDto>(result.Value);
        }

        [Fact]
        public async void LoginUser_should_return_a_Bad_Request_when_User_Not_Found()
        {
            //Arrange 
            var mockUsers = MockUsersData.TestData;
            var mockUserManager = MockUserManagerGenerator.CreateMockUserManager();
            var loginDto = new LoginDto();
            loginDto.Username = "Donna";
            loginDto.Password = "Pa$$w0rd";
            var user = mockUsers.Find(user => user.UserName == loginDto.Username);
            mockUserManager.Setup(x => x.FindByNameAsync(It.IsAny<string>())).ReturnsAsync(user);
            var sut = MockAccountControllerGenerator.CreateAccountController(mockUserManager);

            //Act
            var actionResult = await sut.LoginUser(loginDto);

            //Assert
            var result = actionResult.Result as BadRequestObjectResult;
            Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
        }
    }
}