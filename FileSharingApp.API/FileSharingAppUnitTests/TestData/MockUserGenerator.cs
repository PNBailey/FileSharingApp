using FileSharingApp.API.Models;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FileSharingAppUnitTests.Helpers.ModelMocks
{
    internal static class MockUserGenerator
    {
        internal static AppUser GenerateMockUser()
        {
            var user = new AppUser();
            user.UserName = "Mr Test";
            user.Email = "TestEmail@gmail.com";
            user.Bio = "I am only being used as a test :(";

            return user;
        }
    }
}
