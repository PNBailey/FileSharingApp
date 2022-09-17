using FileSharingApp.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Xunit.Sdk;

namespace FileSharingAppUnitTests.TestData
{
    public class MockUsersData
    {
        private static readonly List<AppUser> Users = new List<AppUser>
        {
             new AppUser()
            {
                Id = 1,
                UserName = "paul",
                Email = "52pbailey@gmail.com"
            },
             new AppUser()
            {
                Id = 2,
                UserName = "john",
                Email = "JohnDoe@gmail.com"
            },
             new AppUser()
            {
                Id = 3,
                UserName = "lorraine",
                Email = "Lorraine2@gmail.com"
            },
             new AppUser()
            {
                Id = 4,
                UserName = "gregg",
                Email = "52Gregg@gmail.com"
            },
             new AppUser()
            {
                Id = 5,
                UserName = "dave",
                Email = "DaveL@gmail.com"
            },
             new AppUser()
            {
                Id = 6,
                UserName = "jimmy",
                Email = "Jimmy@gmail.com"
            },
             new AppUser()
            {
                Id = 7,
                UserName = "pete",
                Email = "52Pete@gmail.com"
            }
        };

        public static List<AppUser> TestData => Users;
    }
}
