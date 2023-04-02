using FileSharingApp.API.Models.DTOs;
using FluentValidation;
using FileSharingApp.API.Services.Interfaces;

public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{
    public RegisterDtoValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty();
        RuleFor(x => x.Password)
            .NotEmpty();
        RuleFor(x => x.Email)
            .NotEmpty();
    }
}