using FileSharingApp.API.CustomExceptions;
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

        [Route("/error")]
        public IActionResult Error()
        {
            var exceptionHandlerFeature = HttpContext.Features.Get<IExceptionHandlerFeature>()!;

            var exceptionType = exceptionHandlerFeature.Error.GetType();

            HttpStatusCode statusCode = getStatusCode(exceptionType);

            _logger.Error(exceptionHandlerFeature.Error, exceptionHandlerFeature.Error.Message);

            return Problem(
                detail: exceptionHandlerFeature.Error.StackTrace,
                statusCode: (int)statusCode,
                type: exceptionType.Name,
                title: exceptionHandlerFeature.Error.Message);
        }

        private HttpStatusCode getStatusCode(Type exceptionType)
        {
            if (exceptionType == typeof(UserNotFoundException))
            {
                return HttpStatusCode.NotFound;
            }
            else if (exceptionType == typeof(PasswordIncorrectException))
            {
                return HttpStatusCode.Unauthorized;
            }
            else if (exceptionType == typeof(ValidationException))
            {
                return HttpStatusCode.Forbidden;
            }
            else if (exceptionType == typeof(AggregateException))
            {
                var exceptionHandlerFeature = HttpContext.Features.Get<IExceptionHandlerFeature>()!;

                AggregateException aggregateException = (AggregateException)exceptionHandlerFeature.Error;

                if (aggregateException.InnerExceptions.Any(innerException => innerException is not UserManagerCreateUserException))
                {
                    return HttpStatusCode.InternalServerError;
                }
                else
                {
                    return HttpStatusCode.UnprocessableEntity;
                }
            }
            else
            {
                return HttpStatusCode.InternalServerError;
            }
        }
    }
}
