using CloudinaryDotNet.Actions;
using FileSharingApp.API.ExtensionMethods;
using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Files;
using FileSharingApp.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FileSharingApp.API.Controllers
{
    [Authorize]
    public class UserController : BaseController
    {
        private readonly IUserService userService;
        private readonly IFileService fileService;

        public UserController(IUserService userService, IFileService fileService)
        {
            this.userService = userService;
            this.fileService = fileService;
        }

        [HttpGet]
        public IEnumerable<UserDto> Get()
        {
            throw new NotImplementedException();
        }

        [HttpGet("{id}")]
        public UserDto Get(int id)
        {
            throw new NotImplementedException();
        }

        [HttpPut("Update")]
        public async Task<IdentityResult> Update([FromBody] AppUser updatedUser)
        {
            return await this.userService.UpdateUser(updatedUser);
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        [HttpPost("Upload-Profile-Picture")]
        public async Task<ImageFile> UploadProfilePicture([FromForm]IFormFile imageFileData)
        {
            var imageFile = new ImageFile()
            {
                FileData = imageFileData
            };

            ImageFile uploadedFile = (ImageFile)await this.fileService.UploadFile(imageFile, User.GetUserId());
            var user = await this.userService.FindByIdAsync(User.GetUserId());
            user.ProfilePictureUrl = uploadedFile.Url.ToString();
            await this.userService.UpdateUser(user);
            
            return uploadedFile;
        }
    }
}
