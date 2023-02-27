using FileSharingApp.API.Models.DTOs.Interfaces;

namespace FileSharingApp.API.Services.Interfaces
{
    public class ValidationService : IValidationService
    {
        public async Task Validate(IValidateDto dtoToValidate)
        {
            await dtoToValidate.Validate();
        }
    }
}
