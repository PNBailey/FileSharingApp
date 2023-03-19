using CloudinaryDotNet.Actions;
using FileSharingApp.API.Controllers;
using FileSharingApp.API.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FileSharingAppUnitTests.Helpers
{
    internal static class UserControllerGenerator
    {
        internal static UserController GenerateUserController(Mock<IPhotoService> mockPhotoService)
        {
            var mockImageUploadResult = new ImageUploadResult();
            mockPhotoService.Setup(x => x.UploadImage(It.IsAny<IFormFile>(), It.IsAny<int>())).Returns(mockImageUploadResult);
            var userController = new UserController(new Mock<IUserService>().Object, mockPhotoService.Object)
            {
                ControllerContext = ControllerContextGenerator.GenerateControllerContext()
            };
            return userController;
        }
    }
}
