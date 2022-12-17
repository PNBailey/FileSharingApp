using FileSharingApp.API.CustomExceptions;
using FileSharingApp.API.Services.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using NLog;
using System.Net;

namespace FileSharingApp.API.Services
{
    public class ErrorService : IErrorService
    {
        private IExceptionHandlerFeature _handler;

        public HttpStatusCode GetStatusCode(Type exceptionType)
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
                AggregateException aggregateException = (AggregateException)_handler.Error;

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
