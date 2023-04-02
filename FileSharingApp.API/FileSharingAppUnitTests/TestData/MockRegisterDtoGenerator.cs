using FileSharingApp.API.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FileSharingAppUnitTests.TestData
{
    internal static class MockRegisterDtoGenerator
    {
        internal static RegisterDto GenerateMockRegisterDto()
        {
            var dto = new RegisterDto();
            dto.Username = "Mr Test";
            dto.Password = "Pa$$w0rd";
            dto.Email = "TestEmail@gmail.com";

            return dto;
        }
    }
}
