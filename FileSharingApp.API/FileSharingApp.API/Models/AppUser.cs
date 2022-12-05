﻿using FluentValidation;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace FileSharingApp.API.Models
{
    public class AppUser : IdentityUser<int>
    {
        public ICollection<AppUserRole> UserRoles { get; set; } = null!;

    }
}