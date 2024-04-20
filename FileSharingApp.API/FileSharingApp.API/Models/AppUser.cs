using FileSharingApp.API.Models.Files;
using FileSharingApp.API.Models.Folders;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

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