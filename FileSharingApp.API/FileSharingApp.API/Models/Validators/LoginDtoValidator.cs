using FileSharingApp.API.Models.DTOs;
using FluentValidation;

namespace FileSharingApp.API.Models.Validators
{
    public class LoginDtoValidator : AbstractValidator<LoginDto>
    {
        /// <summary>
        /// A Fluent Validation Validator to Validate the User when they login. See Fluent Validation documentation here: <see href="https://docs.fluentvalidation.net/en/latest/index.html"/>.
        /// </summary>
        public LoginDtoValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty();
            RuleFor(x => x.Password)
                .NotEmpty();
        }
    }
}
