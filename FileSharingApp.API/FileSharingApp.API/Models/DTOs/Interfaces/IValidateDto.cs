using FileSharingApp.API.Services;
using FileSharingApp.API.Services.Interfaces;

namespace FileSharingApp.API.Models.DTOs.Interfaces
{
    public interface IValidateDto
    {
        Task Validate();
    }
}
