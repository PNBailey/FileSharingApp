using FluentValidation;
using Microsoft.AspNetCore.Identity;

namespace FileSharingApp.Domain.Models
{
    /// <summary>
    ///The Model object for a User
    /// </summary>
    public class User : IdentityUser<int>
    {
        /// <summary>
        /// The <see cref="AppUserRole"/>s.
        /// </summary>
        public ICollection<AppUserRole> UserRoles { get; set; } = null!;
    }

    /// <summary>
    /// A Fluent Validation Validator to Validate the User. See Fluent Validation documentation here: <see href="https://docs.fluentvalidation.net/en/latest/index.html"/>.
    /// </summary>
    public class UserValidator : AbstractValidator<User>
    {
        public UserValidator()
        {
            RuleFor(user => user.Email).NotEmpty();
            RuleFor(user => user.UserName).NotEmpty();
        }
    }
}