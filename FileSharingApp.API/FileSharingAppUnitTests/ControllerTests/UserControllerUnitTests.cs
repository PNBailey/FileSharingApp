using CloudinaryDotNet.Actions;
using FileSharingApp.API.Controllers;
using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Files;
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
        
        //[Fact]
        //public async void UpdateUserProfilePicture_should_call_file_service_upload_method()
        //{
        //    var mockFileService = MockFileServiceGenerator.GenerateMockFileService();
        //    var sut = UserControllerGenerator.GenerateUserController(mockFileService);
        //    var bytes = Encoding.UTF8.GetBytes("This is a dummy file");
        //    IFormFile mockFileData = new FormFile(new MemoryStream(bytes), 0, bytes.Length, "", "TestImage");
        //    ImageFile mockImageFile = new ImageFile()
        //    {
        //        Id = 0,
        //        FileData = mockFileData,
        //        Url = "testUrl"
        //    };
        //    var result = await sut.UploadProfilePicture(mockFileData);
        //    mockFileService.Verify(x => x.UploadFile(mockImageFile, 1234), Times.Once);
        //}

        [Fact]
        public void UploadProfilePicture_should_return_the_uploaded_file()
        {
            var sut = UserControllerGenerator.GenerateUserController();
            var bytes = Encoding.UTF8.GetBytes("This is a dummy file");
            IFormFile mockFileData = new FormFile(new MemoryStream(bytes), 0, bytes.Length, "", "TestImage");
            var result = sut.UploadProfilePicture(mockFileData);
            Assert.IsType<FileDto>(result.Result);
        }

        //[Fact]
        //public async void UpdateUserProfilePicture_should_call_user_service_update_method_if_upload_was_successful()
        //{
        //    var mockUser = MockUserGenerator.GenerateMockUser();
        //    var mockUserService = MockUserServiceGenerator.GenerateMockUserService(mockUser);
        //    var sut = UserControllerGenerator.GenerateUserController(mockUserService);
        //    var bytes = Encoding.UTF8.GetBytes("This is a dummy file");
        //    IFormFile mockFileData = new FormFile(new MemoryStream(bytes), 0, bytes.Length, "", "TestImage");
        //    IFile mockImageFile = new ImageFile()
        //    {
        //        Id = 0,
        //        FileType = ".png",
        //        FileData = mockFileData,
        //        Url = "testUrl"
        //    };
        //    await sut.UploadProfilePicture(mockImageFile);
        //    mockUserService.Verify(x => x.UpdateUser(mockUser), Times.Once);
        //}
    }
}
