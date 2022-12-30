using FileSharingApp.API.Models;
using FileSharingApp.API.Models.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FileSharingApp.API.Services.Interfaces
{
    public interface IUserService
    {
        Task<bool> CheckUserDoesNotAlreadyExistByName(string username, CancellationToken cancellationToken = new CancellationToken());

        Task<bool> CheckUserDoesNotAlreadyExistByEmail(string email, CancellationToken cancellationToken = new CancellationToken());

        Task<IdentityResult> AttemptToCreateUser(AppUser newUser, string password);

        Task<UserDto> CreateUserDto(AppUser user);

        Task<UserDto> HandleSuccessfulUserCreation(AppUser newUser);

        AggregateException HandleUnsuccessfulUserCreation(IEnumerable<IdentityError> identityErrors);

        Task<AppUser> FindByNameAsync(string username);

        Task<bool> CheckPasswordAsync(AppUser user, string password);
    }
}
