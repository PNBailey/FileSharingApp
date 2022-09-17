using FileSharingApp.Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FileSharingApp.Domain.DAL
{
    public class DataContext : IdentityDbContext<
      User,
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
    }
}
