using AutoMapper;
using FileSharingApp.API.CustomExceptions;
using FileSharingApp.API.Helpers;
using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using NLog;

namespace FileSharingApp.API.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<AppUser?> _userManager;
        private static Logger _logger = LogManager.GetCurrentClassLogger();
        private readonly IMapper _mapper;
        private readonly JWTTokenGenerator _jwtTokenGnerator;

        public UserService(UserManager<AppUser?> userManager, IMapper mapper, JWTTokenGenerator jwtTokenGnerator)
        {
            _userManager = userManager;
            _mapper = mapper;
            _jwtTokenGnerator = jwtTokenGnerator;
        }

        public async Task<bool> CheckUserDoesNotAlreadyExistByName(string username, CancellationToken cancellationToken)
        {
            _logger.Info($"Checking whether user exists by username. Username: {username}");
            var user = await _userManager.FindByNameAsync(username.ToLower());
            _logger.Info($"User does not already exist (username: {username}): {user == null}");
            return user == null;
        }

        public virtual async Task<bool> CheckUserDoesNotAlreadyExistByEmail(string email, CancellationToken cancellationToken)
        {
            _logger.Info($"Checking whether user exists by email. Email: {email}");
            var user = await _userManager.FindByEmailAsync(email.ToLower());
            _logger.Info($"User does not already exist (email: {email}): {user == null}");
            return user == null;
        }

        public async Task<IdentityResult> AttemptToCreateUser(AppUser newUser, string password)
        {

            _logger.Info($"Attempting to create user. Username: {newUser.UserName}. Email: {newUser.Email}");

            return await _userManager.CreateAsync(newUser, password);
        }

        public async Task<UserDto> HandleSuccessfulUserCreation(AppUser newUser)
        {
            var userDto = await CreateUserDto(newUser);
            _logger.Info($"User creation successful. Username: {newUser.UserName}");

            return userDto;
        }

        public AggregateException HandleUnsuccessfulUserCreation(IEnumerable<IdentityError> identityErrors)
        {
            var exceptions = new List<UserManagerCreateUserException>();

            foreach (var error in identityErrors)
            {
                exceptions.Add(new UserManagerCreateUserException($"{error}"));
            }

            return new AggregateException("User creation failed.", exceptions);
        }

        public async Task<UserDto> CreateUserDto(AppUser user)
        {
            var token = await _jwtTokenGnerator.CreateJWTToken(user);
            var userDto = _mapper.Map<UserDto>(user);
            userDto.Token = token;

            return userDto;
        }

        public async Task<AppUser> FindByNameAsync(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                throw new UserNotFoundException($"no user found with username: {username}");
            }
            else
            {
                return user;
            }
        }

        public async Task<AppUser> FindByIdAsync(int userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if(user == null)
            {
                throw new UserNotFoundException($"no user found with id: {userId}");
            } 
            else
            {
                return user;
            }
        }

        public async Task<bool> CheckPasswordAsync(AppUser user, string password)
        {
            return await _userManager.CheckPasswordAsync(user, password);
        }

        public async Task<IdentityResult> UpdateUser(AppUser user)
        {
            return await _userManager.UpdateAsync(user);
        }
    }
}
