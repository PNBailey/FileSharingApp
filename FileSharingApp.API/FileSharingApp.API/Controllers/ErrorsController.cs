using FileSharingApp.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using NLog;

namespace FileSharingApp.API.Controllers
{
    [AllowAnonymous]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class ErrorsController : BaseController
    {
        private readonly IErrorService errorService;
        private static Logger _logger = LogManager.GetCurrentClassLogger();
        private readonly IHttpContextAccessor httpContextAccessor;

        public ErrorsController(IHttpContextAccessor httpContextAccessor, IErrorService errorService)
        {
            this.httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
            this.errorService = errorService;
        }

        [Route("/error")]
        public IActionResult Error()
        {
            var handler = httpContextAccessor.HttpContext!.Features.Get<IExceptionHandlerFeature>()!;
            var exception = handler.Error;
            bool isDevelopment = httpContextAccessor.HttpContext.RequestServices.GetRequiredService<IWebHostEnvironment>().IsDevelopment();

            return Problem(
                detail: isDevelopment ? exception.Message : "An internal error occurred. Please try again later.",
                statusCode: (int)errorService.GetStatusCode(exception),
                type: exception.GetType().Name,
                title: "An unexpected error occurred");
        }

        [HttpPost("LogError")]
        public void LogError(string message)
        {
            _logger.Error(message);
        }
    }
}
