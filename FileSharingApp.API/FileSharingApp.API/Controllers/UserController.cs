using AutoMapper;
using FileSharingApp.API.ExtensionMethods;
using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FileSharingApp.API.Controllers
{
    [Authorize]
    public class UserController : BaseController
    {
        private readonly IUserService userService;
        private readonly IFileService fileService;
        private readonly IMapper mapper;

        public UserController(
            IUserService userService, 
            IFileService fileService,
            IMapper mapper)
        {
            this.userService = userService;
            this.fileService = fileService;
            this.mapper = mapper;
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
        public async Task<UserDto> Update([FromBody] AppUser updatedUser)
        {
            var user = await userService.UpdateUser(updatedUser);
            var userDto = mapper.Map<UserDto>(user);
            return userDto;
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        [HttpPost("Upload-Profile-Picture")]
        public async Task<IActionResult> UploadProfilePicture([FromForm]IFormFile imageFileData)
        {
            var storageObject = fileService.AddFileToCloudStorage(imageFileData);
            var signedUrl = fileService.GetSignedUrl(storageObject.Name);
            var user = await userService.FindByIdAsync(User.GetUserId());
            user.ProfilePictureUrl = signedUrl;
            user.ProfilePictureName = storageObject.Name;
            await userService.UpdateUser(user);
            return Ok(new { signedUrl });
        }
    }
}
