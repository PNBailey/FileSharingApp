using FileSharingApp.API.CustomExceptions;
using FileSharingApp.API.Services.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using NLog;
using System.Net;

namespace FileSharingApp.API.Controllers
{
    [AllowAnonymous]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class ErrorsController : BaseController
    {
        private static Logger _logger = LogManager.GetCurrentClassLogger();
        private readonly IErrorService errorService;

        public ErrorsController(IErrorService errorService)
        {
            this.errorService = errorService;
        }

        [Route("/error")]
        public IActionResult Error()
        {
            IExceptionHandlerFeature handler = HttpContext.Features.Get<IExceptionHandlerFeature>()!;

            var exceptionType = handler.Error.GetType();

            HttpStatusCode statusCode = errorService.GetStatusCode(exceptionType);

            return Problem(
                detail: handler.Error.StackTrace,
                statusCode: (int)statusCode,
                type: exceptionType.Name,
                title: handler.Error.Message);
        }

        [HttpPost("LogError")]
        public void LogClientError(string message)
        {
            _logger.Error(message);
        }
    }
}
