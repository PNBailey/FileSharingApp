using CloudinaryDotNet.Actions;
using FileSharingApp.API.ExtensionMethods;
using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FileSharingApp.API.Controllers
{
    public class UserController : BaseController
    {
        private readonly IUserService userService;
        private readonly IPhotoService photoService;
        private readonly UserManager<AppUser> userManager;

        public UserController(IUserService userService, IPhotoService photoService, UserManager<AppUser?> userManager)
        {
            this.userService = userService;
            this.photoService = photoService;
            this.userManager = userManager;
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
        public async Task<IdentityResult> Update([FromBody] AppUser user)
        {
            return await this.userService.UpdateUser(user);
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        [Authorize]
        [HttpPost("Upload-Profile-Picture")]
        public async Task<ImageUploadResult> UploadProfilePicture(IFormFile image)
        {
            var result = this.photoService.UploadImage(image, User.GetUserId());
            if(result.Error == null)
            {
                var user = await this.userService.FindByIdAsync(User.GetUserId());
                user.ProfilePictureUrl = result.PublicId;
                await this.userService.UpdateUser(user);
            }
            return result;
        }
    }
}
