using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using FileSharingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Services.Interfaces;
using NLog;
using FileSharingApp.API.CustomExceptions;

namespace FileSharingApp.API.Controllers
{
    public class AccountController : BaseController
    {
        private static Logger _logger = LogManager.GetCurrentClassLogger();

        private readonly IMapper _mapper;
        private readonly IUserService _userService;

        public AccountController(
            IMapper mapper, 
            IUserService userService)
        {
            _mapper = mapper;
            _userService = userService;
        }

        [AllowAnonymous]
        [HttpGet("CheckUsername")]
        public async Task<ActionResult<bool>> CheckUsernameUnique([FromQuery] string username)
        {
            return Ok(await _userService.CheckUserDoesNotAlreadyExistByName(username));
        }

        [AllowAnonymous]
        [HttpGet("CheckEmail")]
        public async Task<ActionResult<bool>> CheckEmailUnique([FromQuery] string email)
        {
            return Ok(await _userService.CheckUserDoesNotAlreadyExistByEmail(email));
        }

        [HttpPost("Register")]
        public async Task<ActionResult<UserDto>> RegisterUser([FromBody] RegisterDto registerDto)
        {
            _logger.Info($"Register user end point hit. Username {registerDto.Username}");

            await registerDto.Validate(_userService);

            _logger.Info($"Register dto model validation complete. Attempting to create user. Username: {registerDto.Username}. Email: {registerDto.Email}");

            var newUser = _mapper.Map<AppUser>(registerDto);

            var result = await _userService.AttemptToCreateUser(newUser, registerDto.Password);

            if (!result.Succeeded)
            {
                var exceptions = new List<UserManagerCreateUserException>();

                foreach (var error in result.Errors)
                {
                    exceptions.Add(new UserManagerCreateUserException($"{error}"));
                }

                throw new AggregateException("User creation failed.", exceptions);
            }
            else
            {
                return Ok(await _userService.HandleSuccessfulUserCreation(newUser));
            }
        }

        [HttpPost("Login")]
        public async Task<ActionResult<UserDto>> LoginUser([FromBody] LoginDto loginDto)
        {
            _logger.Info($"Login user end point hit. Username {loginDto.Username}");
            await loginDto.Validate(); 

            var user = await _userService.FindByNameAsync(loginDto.Username);
            if (user == null)
            {
                throw new UserNotFoundException($"No user found with the username: {loginDto.Username}");
            }

            var passwordCorrect = await _userService.CheckPasswordAsync(user, loginDto.Password);
            if (passwordCorrect)
            {
                var userDto = await _userService.CreateUserDto(user);
                _logger.Info($"User log in successful. Username {loginDto.Username}");
                return Ok(userDto);
            } 
            else
            {
                throw new PasswordIncorrectException($"Password is incorrect for username: {loginDto.Username}");
            }
        }
    }
}
