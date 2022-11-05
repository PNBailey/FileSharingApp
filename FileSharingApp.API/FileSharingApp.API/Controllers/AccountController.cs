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
            _logger.LogInformation("Checking whether user is unique. Username: {0}", username);
            var user = await _userManager.FindByNameAsync(username.ToLower());
            return user == null;
        }

        [AllowAnonymous]
        [HttpGet("CheckEmail")]
        public async Task<ActionResult<bool>> CheckEmailUnique([FromQuery] string email)
        {
            var user = await _userManager.FindByEmailAsync(email.ToLower());
            return user == null;
        }

        [HttpPost("Register")]
        public async Task<ActionResult<UserDto>> RegisterUser([FromBody] RegisterDto registerDto)
        {
            var registerValidator = new RegisterDtoValidator(_userManager);
            await registerValidator.ValidateAndThrowAsync(registerDto);

            var user = _mapper.Map<AppUser>(registerDto);
            user.UserName = registerDto.Username.ToLower();

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            var userDto = await CreateUserDto(user);

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
