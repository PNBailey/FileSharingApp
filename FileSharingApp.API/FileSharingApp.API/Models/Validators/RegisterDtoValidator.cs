using FileSharingApp.API.Models.DTOs;
using FluentValidation;
using FileSharingApp.API.Services.Interfaces;

public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{
    private readonly IUserService _userService;

    public RegisterDtoValidator(IUserService userService)
    {
        _userService = userService;

        RuleFor(x => x.Username)
            .NotEmpty();
        RuleFor(x => x.Username)
            .MustAsync(_userService.CheckUserDoesNotAlreadyExistByName);
        RuleFor(x => x.Password)
            .NotEmpty();
        RuleFor(x => x.Email)
            .NotEmpty();
        RuleFor(x => x.Email)
            .MustAsync(_userService.CheckUserDoesNotAlreadyExistByEmail);
    }
}