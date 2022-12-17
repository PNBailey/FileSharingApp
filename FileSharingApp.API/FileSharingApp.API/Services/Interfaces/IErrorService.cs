using System.Net;

namespace FileSharingApp.API.Services.Interfaces
{
    public interface IErrorService
    {
        HttpStatusCode GetStatusCode(Type exceptionType);
    }
}
