using FileSharingApp.API.Models.DTOs.Interfaces;
using FileSharingApp.API.Services.Interfaces;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FileSharingAppUnitTests.Helpers.ServiceGenerators.Mocks
{
    internal static class MockValidationServiceGenerator
    {
        internal static Mock<IValidationService> GenerateMockValidationService()
        {
            var mockValidationService = new Mock<IValidationService>();
            mockValidationService.Setup(x => x.Validate(It.IsAny<IValidateDto>())).Returns(Task.CompletedTask);
            return mockValidationService;
        }
    }
}
