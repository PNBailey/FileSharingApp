using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using FileSharingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Services.Interfaces;
using NLog;
using FileSharingApp.API.CustomExceptions;
using System.ComponentModel.DataAnnotations;

namespace FileSharingApp.API.Controllers
{
    public class AccountController : BaseController
    {
        private static Logger _logger = LogManager.GetCurrentClassLogger();

        private readonly IMapper mapper;
        private readonly IUserService userService;
        private readonly IFileService fileService;
        private readonly IValidationService validationService;

        public AccountController(
            IMapper mapper, 
            IUserService userService,
            IFileService fileService,
            IValidationService validationService)
        {
            this.mapper = mapper;
            this.userService= userService;
            this.fileService = fileService;
            this.validationService = validationService;
        }

        [AllowAnonymous]
        [HttpGet("CheckUsername")]
        public async Task<ActionResult<bool>> CheckUsernameUnique([FromQuery] string username)
        {
            return Ok(await userService.CheckUserDoesNotAlreadyExistByName(username));
        }

        [AllowAnonymous]
        [HttpGet("CheckEmail")]
        public async Task<ActionResult<bool>> CheckEmailUnique([FromQuery] string email)
        {
            return Ok(await userService.CheckUserDoesNotAlreadyExistByEmail(email));
        }

        [AllowAnonymous]
        [HttpPost("Register")]
        public async Task<ActionResult<UserDto>> RegisterUser([FromBody] RegisterDto registerDto)
        {
            _logger.Info($"Register user end point hit. Username {registerDto.Username}");

            await validationService.Validate(registerDto);

            if (!await userService.CheckUserDoesNotAlreadyExistByName(registerDto.Username))
            {
                throw new ValidationException("Username already exists");
            }
            
            if(!await userService.CheckUserDoesNotAlreadyExistByEmail(registerDto.Email))
            {
                throw new ValidationException("Email already exists");
            }

            _logger.Info($"Register dto model validation complete. Attempting to create user. Username: {registerDto.Username}. Email: {registerDto.Email}");

            var newUser = mapper.Map<AppUser>(registerDto);

            var result = await userService.AttemptToCreateUser(newUser, registerDto.Password);

            if (!result.Succeeded)
            {
                AggregateException aggregateException = userService.HandleUnsuccessfulUserCreation(result.Errors);
                throw aggregateException;
            }
            else
            {
                return Ok(await userService.HandleSuccessfulUserCreation(newUser));
            }
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<ActionResult<UserDto>> LoginUser([FromBody] LoginDto loginDto)
        {
            _logger.Info($"Login user end point hit. Username {loginDto.Username}");

            await validationService.Validate(loginDto);

            var user = await userService.FindByNameAsync(loginDto.Username);
            if (user == null)
            {
                throw new UserNotFoundException($"No user found with the username: {loginDto.Username}");
            }

            var signInResult = await userService.SignIn(user, loginDto.Password);
            if (signInResult.Succeeded)
            {
                if(user.ProfilePictureName != null)
                {
                    user.ProfilePictureUrl = fileService.GetSignedUrl(user.ProfilePictureName);
                }
                var userDto = await userService.CreateUserDto(user);
                _logger.Info($"User log in successful. Username {loginDto.Username}");
                return Ok(userDto);
            } 
            else
            {
                throw new SignInException("Unable to log in. Please check Username and Password and try again");
            }
        }
    }
}
