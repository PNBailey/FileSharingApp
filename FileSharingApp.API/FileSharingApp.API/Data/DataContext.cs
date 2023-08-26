﻿using FileSharingApp.API.Models;
using FileSharingApp.API.Models.Enums;
using FileSharingApp.API.Models.Files;
using FileSharingApp.API.Models.Folders;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FileSharingApp.API.Data
{
    public class DataContext : IdentityDbContext<
      AppUser,
      AppRole,
      int,
      IdentityUserClaim<int>,
      AppUserRole,
      IdentityUserLogin<int>,
      IdentityRoleClaim<int>,
      IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions<DataContext> options)
        : base(options)
        {
        }

        public DbSet<BaseFile> Files { get; set; }
        public DbSet<XmlFile> XmlFiles { get; set; }
        public DbSet<PdfFile> PdfFiles { get; set; }
        public DbSet<ImageFile> ImageFiles { get; set; }
        public DbSet<Folder> Folders { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<AppUser>()
                 .HasMany(ur => ur.UserRoles)
                 .WithOne(u => u.User)
                 .HasForeignKey(ur => ur.UserId)
                 .IsRequired();

            builder.Entity<AppRole>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(u => u.Role)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();

            builder.Entity<UserFolder>()
                .HasKey(key => new { key.FolderId, key.FolderOwnerId });

            builder.Entity<UserFolder>()
                .HasOne(uf => uf.FolderOwner)
                .WithMany(u => u.Folders)
                .HasForeignKey(uf => uf.FolderOwnerId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserFolder>()
               .HasOne(uf => uf.Folder)
               .WithMany(f => f.Users)
               .HasForeignKey(uf => uf.FolderId)
               .OnDelete(DeleteBehavior.Cascade);

        }

    }
}
