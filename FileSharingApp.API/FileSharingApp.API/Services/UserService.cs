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
        private readonly UserManager<AppUser?> userManager;
        private static Logger logger = LogManager.GetCurrentClassLogger();
        private readonly IMapper mapper;
        private readonly JWTTokenGenerator jwtTokenGnerator;
        private readonly SignInManager<AppUser> signInManager;

        public UserService(UserManager<AppUser?> userManager, IMapper mapper, JWTTokenGenerator jwtTokenGnerator, SignInManager<AppUser> signInManager)
        {
            this.userManager = userManager;
            this.mapper = mapper;
            this.jwtTokenGnerator = jwtTokenGnerator;
            this.signInManager = signInManager;
        }

        public async Task<bool> CheckUserDoesNotAlreadyExistByName(string username, CancellationToken cancellationToken)
        {
            logger.Info($"Checking whether user exists by username. Username: {username}");
            var user = await userManager.FindByNameAsync(username.ToLower());
            logger.Info($"User does not already exist (username: {username}): {user == null}");
            return user == null;
        }

        public virtual async Task<bool> CheckUserDoesNotAlreadyExistByEmail(string email, CancellationToken cancellationToken)
        {
            logger.Info($"Checking whether user exists by email. Email: {email}");
            var user = await userManager.FindByEmailAsync(email.ToLower());
            logger.Info($"User does not already exist (email: {email}): {user == null}");
            return user == null;
        }

        public async Task<IdentityResult> AttemptToCreateUser(AppUser newUser, string password)
        {

            logger.Info($"Attempting to create user. Username: {newUser.UserName}. Email: {newUser.Email}");

            return await userManager.CreateAsync(newUser, password);
        }

        public async Task<UserDto> HandleSuccessfulUserCreation(AppUser newUser)
        {
            var userDto = await CreateUserDto(newUser);
            logger.Info($"User creation successful. Username: {newUser.UserName}");

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
            var token = await jwtTokenGnerator.CreateJWTToken(user);
            var userDto = mapper.Map<UserDto>(user);
            userDto.Token = token;

            return userDto;
        }

        public async Task<AppUser> FindByNameAsync(string username)
        {
            var user = await userManager.FindByNameAsync(username);
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
            var user = await userManager.FindByIdAsync(userId.ToString());
            if(user == null)
            {
                throw new UserNotFoundException($"no user found with id: {userId}");
            } 
            else
            {
                return user;
            }
        }

        public async Task<IdentityResult> UpdateUser(AppUser updatedUser)
        {
            var existingUser = await userManager.FindByIdAsync(updatedUser.Id.ToString());
            if(existingUser != null)
            {
                existingUser.Email = updatedUser.Email;
                existingUser.ProfilePictureUrl = updatedUser.ProfilePictureUrl;
                existingUser.Bio = updatedUser.Bio;
                existingUser.UserName = updatedUser.UserName;
            }
            return await userManager.UpdateAsync(existingUser);
        }

        public async Task<SignInResult> SignIn(AppUser user, string password)
        {
            return await signInManager.CheckPasswordSignInAsync(user, password, false);
        } 
    }
}
