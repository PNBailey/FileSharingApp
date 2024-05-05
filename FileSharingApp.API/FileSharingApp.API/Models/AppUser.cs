using FileSharingApp.API.Models.Folders;
using Microsoft.AspNetCore.Identity;

namespace FileSharingApp.API.Models
{
    public class AppUser : IdentityUser<int>
    {
        public ICollection<AppUserRole>? UserRoles { get; set; }

        public string? Bio { get; set; }

        public string? ProfilePictureUrl { get; set; }

        public ICollection<UserFolder>? Folders { get; set; }

    }
}