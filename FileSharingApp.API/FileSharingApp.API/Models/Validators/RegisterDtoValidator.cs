using FileSharingApp.API.Models.DTOs;
using FileSharingApp.API.Models;
using FluentValidation;
using Microsoft.AspNetCore.Identity;

public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{

    private readonly UserManager<AppUser?> _userManager;

    public RegisterDtoValidator(UserManager<AppUser?> userManager)
    {
        _userManager = userManager;

        RuleFor(x => x.Username)
            .NotEmpty();
        RuleFor(x => x.Username)
            .MustAsync(NotAlreadyExistAsync)
            .WithMessage("User already exists! Please sign in by clicking on the sign in link below");
        RuleFor(x => x.Password)
            .NotEmpty();
        RuleFor(x => x.Email)
            .NotEmpty();
    }

    public async Task<bool> NotAlreadyExistAsync(string username, CancellationToken cancellation)
    {
        var user = await _userManager.FindByNameAsync(username);
        return user == null;
    }
}