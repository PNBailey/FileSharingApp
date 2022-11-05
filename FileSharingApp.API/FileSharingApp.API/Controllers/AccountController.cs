using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using FileSharingApp.API.Models;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models.Validators;
using FileSharingApp.API.Helpers;

namespace FileSharingApp.API.Controllers
{
    public class AccountController : BaseController
    {
        private readonly UserManager<AppUser?> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IMapper _mapper;
        private readonly JWTTokenGenerator _jwtTokenGnerator;
        private readonly ILogger<AccountController> _logger;

        public AccountController(
            UserManager<AppUser?> userManager, 
            SignInManager<AppUser> signInManager, 
            IMapper mapper, 
            IConfiguration configuration,
            JWTTokenGenerator jwtTokenGnerator,
            ILogger<AccountController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _jwtTokenGnerator = jwtTokenGnerator;
            _logger = logger;
        }

        [AllowAnonymous]
        [HttpGet("CheckUsername")]
        public async Task<ActionResult<bool>> CheckUsernameUnique([FromQuery]string username)
        {
            _logger.LogInformation($"Checking whether username is unique. Username: {username}");
            var user = await _userManager.FindByNameAsync(username.ToLower());
            _logger.LogInformation($"Username is unique (username: {username}): {user == null}");
            return user == null;
        }

        [AllowAnonymous]
        [HttpGet("CheckEmail")]
        public async Task<ActionResult<bool>> CheckEmailUnique([FromQuery] string email)
        {
            _logger.LogInformation($"Checking whether email is unique. Email: {email}");
            var user = await _userManager.FindByEmailAsync(email.ToLower());
            _logger.LogInformation($"Email is unique (email: {email}): {user == null}");
            return user == null;
        }

        [HttpPost("Register")]
        public async Task<ActionResult<UserDto>> RegisterUser([FromBody] RegisterDto registerDto)
        {
            _logger.LogInformation($"Attempting to register user. Username: {registerDto.Username}. Email: {registerDto.Email}");
            var registerValidator = new RegisterDtoValidator(_userManager);
            await registerValidator.ValidateAndThrowAsync(registerDto);
            _logger.LogInformation($"Register user API validation checks passed. Username: {registerDto.Username}");

            var user = _mapper.Map<AppUser>(registerDto);
            user.UserName = registerDto.Username.ToLower();

            _logger.LogInformation($"Attempting to create user. Username: {registerDto.Username}. Email: {registerDto.Email}");
            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded) 
            {
                foreach(var error in result.Errors)
                {
                    _logger.LogError($"User creation failed. Error caused in User Manager. Error: {error}");
                }
                return BadRequest(result.Errors);
            }
            var userDto = await CreateUserDto(user);
            _logger.LogInformation($"User creation successful. Username: {registerDto.Username}. Email: {registerDto.Email}");

            return Ok(userDto);
        }

        [HttpPost("Login")]
        public async Task<ActionResult<UserDto>> LoginUser([FromBody] LoginDto loginDto)
        {
            var loginValidator = new LoginDtoValidator();
            loginValidator.ValidateAndThrow(loginDto);  

            var user = await _userManager.FindByNameAsync(loginDto.Username);
            if (user == null)
            {
                return BadRequest("No user found with that Username. Please click Register below to Register");
            }

            if (user != null && await _userManager.CheckPasswordAsync(user, loginDto.Password))
            {
                var userDto = await CreateUserDto(user);
                return Ok(userDto);
            }

            return Unauthorized();
        }

        private async Task<UserDto> CreateUserDto(AppUser user)
        {
            var token = await _jwtTokenGnerator.CreateJWTToken(user);
            var userDto = _mapper.Map<UserDto>(user);
            userDto.Token = token;

            return userDto;
        }
    }
}
