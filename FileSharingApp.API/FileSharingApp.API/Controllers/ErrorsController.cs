using FileSharingApp.API.Services.Interfaces;
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
        private readonly IHttpContextAccessor httpContextAccessor;

        public ErrorsController(IErrorService errorService, IHttpContextAccessor httpContextAccessor)
        {
            this.errorService = errorService;
            this.httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        }

        [Route("/error")]
        public IActionResult Error()
        {
            IExceptionHandlerFeature handler = this.httpContextAccessor.HttpContext!.Features.Get<IExceptionHandlerFeature>()!;

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
