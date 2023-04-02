using FileSharingApp.API.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FileSharingAppUnitTests.TestData
{
    internal static class MockLoginDtoGenerator
    {
        internal static LoginDto GenerateMockLoginDto()
        {
            var dto = new LoginDto();
            dto.Username = "Mr Test";
            dto.Password = "Pa$$w0rd";

            return dto;
        }
    }
}
