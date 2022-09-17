using FluentValidation;
using Microsoft.AspNetCore.Identity;

namespace FileSharingApp.API.Models
{
    /// <summary>
    ///The Model object for a User
    /// </summary>
    public class AppUser : IdentityUser<int>
    {
        /// <summary>
        /// The <see cref="AppUserRole"/>s.
        /// </summary>
        public ICollection<AppUserRole> UserRoles { get; set; } = null!;
    }
}