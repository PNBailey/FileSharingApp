using FileSharingApp.API.Models.DTOs.Interfaces;

namespace FileSharingApp.API.Services.Interfaces
{
    public interface IValidationService
    {
        Task Validate(IValidateDto dtoToValidate);
    }
}
