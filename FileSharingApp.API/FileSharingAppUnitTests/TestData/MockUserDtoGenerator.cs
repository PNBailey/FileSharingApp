using FileSharingApp.API.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FileSharingAppUnitTests.TestData
{
    internal static class MockUserDtoGenerator
    {
        internal static UserDto GenerateMockUserDto()
        {
            var userDto = new UserDto();
            userDto.Username = "Mr Test";
            userDto.Name = "Mr Test";
            return userDto;
        }
    }
}
