using CloudinaryDotNet.Actions;
using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;

namespace FileSharingApp.API.Controllers
{
    public class UserController : BaseController
    {
        private readonly IUserService userService;
        private readonly IPhotoService photoService;

        public UserController(IUserService userService, IPhotoService photoService)
        {
            this.userService = userService;
            this.photoService = photoService;
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

        [HttpPost("Upload-Profile-Picture")]
        public ImageUploadResult UploadProfilePicture(IFormFile image)
        {
            var result = this.photoService.UploadImage(image);
            return result;
        }
    }
}
