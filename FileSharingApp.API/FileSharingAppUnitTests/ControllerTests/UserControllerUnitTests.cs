using CloudinaryDotNet.Actions;
using FileSharingApp.API.Controllers;
using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Services.Interfaces;
using FileSharingAppUnitTests.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace FileSharingAppUnitTests.ControllerTests
{
    public class UserControllerUnitTests
    {
        [Fact]
        public async void UpdateUser_should_call_UserService_UpdateUser_Method()
        {
            var mockUserService = new Mock<IUserService>();
            var identityResult = IdentityResult.Success;
            var task = Task.FromResult(identityResult);
            mockUserService.Setup(x => x.UpdateUser(It.IsAny<AppUser>())).Returns(task);
            var user = new AppUser();
            var sut = new UserController(mockUserService.Object, new Mock<IPhotoService>().Object);
            var result = await sut.Update(user);
            mockUserService.Verify(x => x.UpdateUser(user), Times.Once);
        }
        
        [Fact]
        public async void UpdateUser_should_return_an_Identity_Result()
        {
            var mockUserService = new Mock<IUserService>();
            var identityResult = IdentityResult.Success;
            var task = Task.FromResult(identityResult);
            mockUserService.Setup(x => x.UpdateUser(It.IsAny<AppUser>())).Returns(task);
            var user = new AppUser();
            var sut = new UserController(mockUserService.Object, new Mock<IPhotoService>().Object);
            var result = await sut.Update(user);
            Assert.IsType<IdentityResult>(identityResult);
        }
        
        [Fact]
        public void UpdateUserProfilePicture_should_call_photo_service_upload_method()
        {
            var mockPhotoService = new Mock<IPhotoService>();
            var mockImageUploadResult = new ImageUploadResult();
            mockPhotoService.Setup(x => x.UploadImage(It.IsAny<IFormFile>(), It.IsAny<int>())).Returns(mockImageUploadResult);
            var sut = new UserController(new Mock<IUserService>().Object, mockPhotoService.Object);
            var bytes = Encoding.UTF8.GetBytes("This is a dummy file");
            IFormFile mockImage = new FormFile(new MemoryStream(bytes), 0, bytes.Length, "", "TestImage");
            sut.UploadProfilePicture(mockImage);
            mockPhotoService.Verify(x => x.UploadImage(mockImage, 1234), Times.Once);
        }

        [Fact]
        public void UpdateUserProfilePicture_should_return_an_ImageUploadResult()
        {
            var mockPhotoService = new Mock<IPhotoService>();
            var mockImageUploadResult = new ImageUploadResult();
            mockPhotoService.Setup(x => x.UploadImage(It.IsAny<IFormFile>(), It.IsAny<int>())).Returns(mockImageUploadResult);
            var sut = new UserController(new Mock<IUserService>().Object, mockPhotoService.Object);
            var bytes = Encoding.UTF8.GetBytes("This is a dummy file");
            IFormFile mockImage = new FormFile(new MemoryStream(bytes), 0, bytes.Length, "", "TestImage");
            var result = sut.UploadProfilePicture(mockImage);
            Assert.IsType<ImageUploadResult>(result);
        }
    }
}
