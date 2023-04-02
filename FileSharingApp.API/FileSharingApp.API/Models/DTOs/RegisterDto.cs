using FileSharingApp.API.Models.DTOs.Interfaces;
using FileSharingApp.API.Services.Interfaces;
using FluentValidation;
using NLog;

namespace FileSharingApp.API.Models.DTOs
{
    public class RegisterDto : IValidateDto
    {
        private static Logger _logger = LogManager.GetCurrentClassLogger();

        public string Username { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public async Task Validate()
        {
            _logger.Info($"Attempting to validate Register Dto. Username: {Username}. Email: {Email}");

            var registerValidator = new RegisterDtoValidator();
            await registerValidator.ValidateAndThrowAsync(this);
        }
    }
}
