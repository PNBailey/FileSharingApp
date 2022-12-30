using Microsoft.AspNetCore.Identity;

namespace FileSharingApp.API.Models
{
    /// <summary>
    /// The AppRole Model for use with Identity Framework
    /// </summary>
    public class AppRole : IdentityRole<int>
    {
        public ICollection<AppUserRole> UserRoles { get; set; } = null!;
    }
}
