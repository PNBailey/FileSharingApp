using FileSharingApp.API.Models;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace FileSharingAppUnitTests.ModelTests
{
    public class ModelTests
    {
        [Fact]
        public void App_role_properties_are_correctly_set()
        {
            //Arrange
            AppRole appRole = new AppRole();
            appRole.Name = "Test role";

            //Assert 
            Assert.Equal("Test role", appRole.Name);
        }

        [Fact]
        public void App_user_properties_are_correctly_set()
        {
            //Arrange
            AppUser appUser = new AppUser();
            appUser.UserName = "Test username";

            //Assert 
            Assert.Equal("Test username", appUser.UserName);
        }

        [Fact]
        public void App_user_role_properties_are_correctly_set()
        {
            //Arrange
            AppUserRole appUserRole = new AppUserRole();
            appUserRole.User = new AppUser();
            appUserRole.User.Email = "TestEmail@gmail.com";

            //Assert 
            Assert.Equal("TestEmail@gmail.com", appUserRole.User.Email);
        }
    }
}
