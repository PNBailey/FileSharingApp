using FileSharingApp.API.CustomExceptions;
using FileSharingApp.API.Services.Interfaces;
using FluentValidation;
using System.Net;

namespace FileSharingApp.API.Services
{
    public class ErrorService : IErrorService
    {
        public HttpStatusCode GetStatusCode(Exception exception)
        {
            var exceptionType = exception.GetType();

            if (exceptionType == typeof(UserNotFoundException))
            {
                return HttpStatusCode.NotFound;
            }
            else if (exceptionType == typeof(SignInException))
            {
                return HttpStatusCode.Unauthorized;
            }
            else if (exceptionType == typeof(ValidationException))
            {
                return HttpStatusCode.Forbidden;
            }
            else if (exceptionType == typeof(AggregateException))
            {
                AggregateException aggregateException = (AggregateException)exception;

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
