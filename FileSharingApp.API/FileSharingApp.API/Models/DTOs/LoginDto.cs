using FileSharingApp.API.Models.Validators;
using FileSharingApp.API.Services.Interfaces;
using FluentValidation;
using NLog;

namespace FileSharingApp.API.Models.DTOs
{
    public class LoginDto
    {
        private static Logger _logger = LogManager.GetCurrentClassLogger();

        public string Username { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public async Task Validate()
        {
            _logger.Info($"Attempting to validate Login Dto. Username: {Username}");

            var loginDtoValidator = new LoginDtoValidator();
            await loginDtoValidator.ValidateAndThrowAsync(this);
        }
    }
}