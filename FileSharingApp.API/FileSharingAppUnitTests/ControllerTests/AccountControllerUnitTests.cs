using FileSharingApp.API.CustomExceptions;
using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingAppUnitTests.Helpers;
using FileSharingAppUnitTests.Helpers.ModelMocks;
using FileSharingAppUnitTests.TestClasses;
using FileSharingAppUnitTests.TestData;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace FileSharingAppUnitTests.ControllerTests
{
    public class AccountControllerUnitTests : BaseUnitTest
    {

        [Fact]
        public async void CheckUsernameUnique_should_return_true_when_CheckUserDoesNotAlreadyExistByName_user_service_method_returns_true()
        {
            //Arrange 
            var mockUserService = MockUserServiceGenerator.GenerateMockUserService();
            var sut = AccountControllerGenerator.CreateAccountController(mockUserService.Object);

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
            var mockUserService = MockUserServiceGenerator.GenerateMockUserService();
            var sut = AccountControllerGenerator.CreateAccountController(mockUserService.Object);

            //Act
            var actionResult = await sut.CheckEmailUnique("test@gmail.com");

            //Assert
            var result = actionResult.Result as OkObjectResult;
            Assert.True((bool)result!.Value!);
        }

        [Fact]
        public async void RegisterUser_should_return_a_OkObjestResult_which_wraps_a_userDto_when_register_Dto_is_valid()
        {
            //Arrange 
            var registerDto = MockRegisterDtoGenerator.GenerateMockRegisterDto();
            var mockUserService = MockUserServiceGenerator.GenerateMockUserService();
            var sut = AccountControllerGenerator.CreateAccountController(mockUserService.Object);

            //Act
            var actionResult = await sut.RegisterUser(registerDto);

            //Assert
            Assert.IsType<OkObjectResult>(actionResult.Result);
            var result = actionResult.Result as OkObjectResult;
            Assert.IsType<UserDto>(result!.Value);
        }

        [Fact]
        public async void RegisterUser_should_return_an_AggregateException_when_user_creation_is_unsuccessful()
        {
            //Arrange 
            var registerDto = MockRegisterDtoGenerator.GenerateMockRegisterDto();
            var mockUserService = MockUserServiceGenerator.GenerateMockUserService();
            var identityResult = IdentityResult.Failed(new IdentityError());
            var identityResultTask = Task.FromResult(identityResult);
            mockUserService.Setup(x => x.AttemptToCreateUser(It.IsAny<AppUser>(), It.IsAny<string>())).Returns(identityResultTask);
            var sut = AccountControllerGenerator.CreateAccountController(mockUserService.Object);

            //Act 
            try
            {
                await sut.RegisterUser(registerDto);
            }

            //Assert
            catch (Exception ex)
            {
                Assert.IsType<AggregateException>(ex);
            }
        }

        [Fact]
        public async void RegisterUser_should_return_an_AggregateException_containing_a_list_of_UserManagerCreateUserExceptions_when_user_creation_is_unsuccessful()
        {
            //Arrange 
            var registerDto = MockRegisterDtoGenerator.GenerateMockRegisterDto();
            var mockUserService = MockUserServiceGenerator.GenerateMockUserService();
            var identityResult = IdentityResult.Failed(new IdentityError());
            var identityResultTask = Task.FromResult(identityResult);
            mockUserService.Setup(x => x.AttemptToCreateUser(It.IsAny<AppUser>(), It.IsAny<string>())).Returns(identityResultTask);
            var sut = AccountControllerGenerator.CreateAccountController(mockUserService.Object);

            //Act
            try
            {
                await sut.RegisterUser(registerDto);
            }

            //Assert
            catch (AggregateException aggregateException)
            {
                var innerExeptions = aggregateException.InnerExceptions.ToList();
                Assert.All(innerExeptions, 
                    innerException => Assert.IsType<UserManagerCreateUserException>(innerException)
                );
            }
        }

        [Fact]
        public async void LoginUser_should_return_a_UserNotFoundException_when_User_Not_Found()
        {
            //Arrange 
            var mockUserService = MockUserServiceGenerator.GenerateMockUserService();
            var sut = AccountControllerGenerator.CreateAccountController(mockUserService.Object);
            var loginDto = MockLoginDtoGenerator.GenerateMockLoginDto();

            //Act
            try
            {
                await sut.LoginUser(loginDto);
            }

            //Assert
            catch (Exception ex)
            {
                Assert.IsType<UserNotFoundException>(ex);
            }

        }

        [Fact]
        public async void LoginUser_should_return_a_ok_response_when_User_Found_and_password_correct()
        {
            //Arrange 
            var mockUserService = MockUserServiceGenerator.GenerateMockUserService();
            mockUserService.Setup(x => x.FindByNameAsync(It.IsAny<string>())).Returns(Task.FromResult(MockUserGenerator.GenerateMockUser()));
            var sut = AccountControllerGenerator.CreateAccountController(mockUserService.Object);
            var loginDto = MockLoginDtoGenerator.GenerateMockLoginDto();

            //Act
            var actionResult = await sut.LoginUser(loginDto);

            //Assert
            var result = actionResult.Result as OkObjectResult;
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async void LoginUser_should_return_a_User_dto_response_when_User_Found_and_password_correct()
        {
            //Arrange 
            var mockUserService = MockUserServiceGenerator.GenerateMockUserService();
            mockUserService.Setup(x => x.FindByNameAsync(It.IsAny<string>())).Returns(Task.FromResult(MockUserGenerator.GenerateMockUser()));
            var sut = AccountControllerGenerator.CreateAccountController(mockUserService.Object);
            var loginDto = MockLoginDtoGenerator.GenerateMockLoginDto();

            //Act
            var actionResult = await sut.LoginUser(loginDto);

            //Assert
            var result = actionResult.Result as OkObjectResult;
            Assert.IsType<UserDto>(result!.Value);
        }
        
        [Fact]
        public async void LoginUser_should_return_a_Sign_In_exception_when_Sign_In_Result_Succeeded_is_false()
        {
            //Arrange 
            var mockUserService = MockUserServiceGenerator.GenerateMockUserService();
            mockUserService.Setup(x => x.SignIn(It.IsAny<AppUser>(), It.IsAny<string>())).Returns(Task.FromResult((Microsoft.AspNetCore.Identity.SignInResult)new MockSignInResult(false)));
            mockUserService.Setup(x => x.FindByNameAsync(It.IsAny<string>())).Returns(Task.FromResult(MockUserGenerator.GenerateMockUser()));
            var sut = AccountControllerGenerator.CreateAccountController(mockUserService.Object);
            var loginDto = MockLoginDtoGenerator.GenerateMockLoginDto();

            //Act
            try
            {
                var actionResult = await sut.LoginUser(loginDto);
            } 

            //Assert
            catch(Exception ex)
            {
                Assert.IsType<SignInException>(ex);
            }
        }
    }
}