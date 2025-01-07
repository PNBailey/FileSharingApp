using FileSharingApp.API.Models;
using FileSharingApp.API.Models.Files;
using FileSharingApp.API.Models.Folders;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Reflection.Emit;

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
        public DbSet<FileType> FileTypes { get; set; }
        public DbSet<Folder> Folders { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            var ukTimeZone = TimeZoneInfo.FindSystemTimeZoneById("GMT Standard Time");

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
                .HasKey(key => new { key.FolderId, key.UserId });

            builder.Entity<UserFolder>()
                .HasOne(uf => uf.User)
                .WithMany(u => u.Folders)
                .HasForeignKey(uf => uf.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<UserFolder>()
               .HasOne(uf => uf.Folder)
               .WithMany(f => f.Users)
               .HasForeignKey(uf => uf.FolderId)
               .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Folder>()
                .HasOne(f => f.ParentFolder)
                .WithMany(pf => pf.SubFolders)
                .HasForeignKey(f => f.ParentFolderId);

            builder.Entity<FileType>()
                .HasData(
                    new FileType() { Id = 1, Name = "Excel", Icon = "pi-file-excel" },
                    new FileType() { Id = 2, Name = "Word", Icon = "pi-file-word" },
                    new FileType() { Id = 3, Name = "Pdf", Icon = "pi-file-pdf" },
                    new FileType() { Id = 4, Name = "Image", Icon = "pi-image" },
                    new FileType() { Id = 5, Name = "PowerPoint", Icon = "pi-images" }
                );
        }

    }
}
