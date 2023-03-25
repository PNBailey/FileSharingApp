using CloudinaryDotNet.Actions;
using FileSharingApp.API.Controllers;
using FileSharingApp.API.Models;
using FileSharingApp.API.Services.Interfaces;
using FileSharingAppUnitTests.Helpers;
using FileSharingAppUnitTests.Helpers.ModelMocks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Moq;
using System.Text;
using Xunit;

namespace FileSharingAppUnitTests.ControllerTests
{
    public class UserControllerUnitTests
    {
        [Fact]
        public async void UpdateUser_should_call_UserService_UpdateUser_Method()
        {
            var mockUser = MockUserGenerator.GenerateMockUser();
            var mockUserService = MockUserServiceGenerator.GenerateMockUserService(mockUser);
            var sut = UserControllerGenerator.GenerateUserController(mockUserService);
            var result = await sut.Update(mockUser);
            mockUserService.Verify(x => x.UpdateUser(mockUser), Times.Once);
        }
        
        [Fact]
        public async void UpdateUser_should_return_an_Identity_Result()
        {
            var user = new AppUser();
            var sut = UserControllerGenerator.GenerateUserController();
            var result = await sut.Update(user);
            Assert.IsType<IdentityResult>(result);
        }
        
        [Fact]
        public async void UpdateUserProfilePicture_should_call_photo_service_upload_method()
        {
            var mockPhotoService = MockPhotoServiceGenerator.GenerateMockPhotoService();
            var sut = UserControllerGenerator.GenerateUserController(mockPhotoService);
            var bytes = Encoding.UTF8.GetBytes("This is a dummy file");
            IFormFile mockImage = new FormFile(new MemoryStream(bytes), 0, bytes.Length, "", "TestImage");
            await sut.UploadProfilePicture(mockImage);
            mockPhotoService.Verify(x => x.UploadImage(mockImage, 1234), Times.Once);
        }

        [Fact]
        public void UpdateUserProfilePicture_should_return_an_ImageUploadResult()
        {
            var sut = UserControllerGenerator.GenerateUserController();
            var bytes = Encoding.UTF8.GetBytes("This is a dummy file");
            IFormFile mockImage = new FormFile(new MemoryStream(bytes), 0, bytes.Length, "", "TestImage");
            var result = sut.UploadProfilePicture(mockImage);
            Assert.IsType<ImageUploadResult>(result.Result);
        }

        [Fact]
        public async void UpdateUserProfilePicture_should_call_user_service_update_method_if_upload_was_successful()
        {
            var mockUser = MockUserGenerator.GenerateMockUser();
            var mockUserService = MockUserServiceGenerator.GenerateMockUserService(mockUser);
            var sut = UserControllerGenerator.GenerateUserController(mockUserService);
            var bytes = Encoding.UTF8.GetBytes("This is a dummy file");
            IFormFile mockImage = new FormFile(new MemoryStream(bytes), 0, bytes.Length, "", "TestImage");
            await sut.UploadProfilePicture(mockImage);
            mockUserService.Verify(x => x.UpdateUser(mockUser), Times.Once);
        }
    }
}
